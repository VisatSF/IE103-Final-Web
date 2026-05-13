
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_menu_categories$$
DROP PROCEDURE IF EXISTS sp_get_all_menu_items$$
DROP PROCEDURE IF EXISTS sp_get_menu_items_by_category$$
DROP PROCEDURE IF EXISTS sp_get_published_news$$
DROP PROCEDURE IF EXISTS sp_get_active_promotions$$
DROP PROCEDURE IF EXISTS sp_get_promotion_by_code$$
DROP PROCEDURE IF EXISTS sp_calculate_discount$$
DROP PROCEDURE IF EXISTS sp_get_cities$$
DROP PROCEDURE IF EXISTS sp_get_districts$$
DROP PROCEDURE IF EXISTS sp_get_stores$$
DROP PROCEDURE IF EXISTS sp_get_open_jobs$$
DROP PROCEDURE IF EXISTS sp_create_contact_message$$
DROP PROCEDURE IF EXISTS sp_create_user$$
DROP PROCEDURE IF EXISTS sp_authenticate_user$$
DROP PROCEDURE IF EXISTS sp_get_user_by_id$$
DROP PROCEDURE IF EXISTS sp_get_user_by_email$$
DROP PROCEDURE IF EXISTS sp_get_store_by_id$$
DROP PROCEDURE IF EXISTS sp_create_order$$
DROP PROCEDURE IF EXISTS sp_has_promotion_usage$$
DROP PROCEDURE IF EXISTS sp_record_promotion_usage$$
DROP PROCEDURE IF EXISTS sp_get_orders_for_store$$
DROP PROCEDURE IF EXISTS sp_get_orders_for_customer$$
DROP PROCEDURE IF EXISTS sp_update_order_status$$
DROP PROCEDURE IF EXISTS sp_clear_orders_for_store$$
DROP PROCEDURE IF EXISTS sp_get_store_cleanup_settings$$
DROP PROCEDURE IF EXISTS sp_update_store_cleanup_settings$$
DROP PROCEDURE IF EXISTS sp_cleanup_store_orders_before$$
DROP PROCEDURE IF EXISTS sp_get_order_status$$

CREATE PROCEDURE sp_get_menu_categories()
BEGIN
  SELECT id, slug, name, display_order
  FROM menu_categories
  WHERE is_active = 1
  ORDER BY display_order ASC, id ASC;
END$$

CREATE PROCEDURE sp_get_all_menu_items()
BEGIN
  SELECT
    mi.id,
    mi.name,
    mi.description,
    mi.price,
    mi.image_url,
    mc.slug AS category_slug,
    mc.name AS category_name
  FROM menu_items mi
  INNER JOIN menu_categories mc ON mc.id = mi.category_id
  WHERE mi.is_active = 1 AND mc.is_active = 1
  ORDER BY mc.display_order ASC, mi.display_order ASC, mi.id ASC;
END$$

CREATE PROCEDURE sp_get_menu_items_by_category(IN p_category_slug VARCHAR(150))
BEGIN
  SELECT mi.id, mi.name, mi.description, mi.price, mi.image_url, mc.slug AS category_slug
  FROM menu_items mi
  INNER JOIN menu_categories mc ON mc.id = mi.category_id
  WHERE mc.slug = p_category_slug AND mi.is_active = 1
  ORDER BY mi.display_order ASC, mi.id ASC;
END$$

CREATE PROCEDURE sp_get_published_news(IN p_limit INT)
BEGIN
  SELECT id, slug, title, summary, content, image_url, published_at
  FROM news_posts
  WHERE status = 'published'
  ORDER BY published_at DESC, id DESC
  LIMIT p_limit;
END$$

CREATE PROCEDURE sp_get_active_promotions()
BEGIN
  SELECT id, title, description, promo_code, discount_type, discount_value, icon_key, valid_from, valid_until, terms
  FROM promotions
  WHERE status = 'active'
  ORDER BY COALESCE(valid_until, '2099-12-31') ASC, id DESC;
END$$

CREATE PROCEDURE sp_get_promotion_by_code(IN p_promo_code VARCHAR(100))
BEGIN
  SELECT id, title, description, promo_code, discount_type, discount_value, icon_key, valid_from, valid_until, terms, status
  FROM promotions
  WHERE promo_code = p_promo_code
  LIMIT 1;
END$$

CREATE PROCEDURE sp_calculate_discount(
  IN p_promo_code VARCHAR(100),
  IN p_items_json JSON
)
BEGIN
  DECLARE v_promotion_id BIGINT DEFAULT NULL;
  DECLARE v_discount_type VARCHAR(50) DEFAULT NULL;
  DECLARE v_discount_value DECIMAL(12,2) DEFAULT 0;
  DECLARE v_status VARCHAR(50) DEFAULT NULL;
  DECLARE v_subtotal DECIMAL(12,2) DEFAULT 0;
  DECLARE v_discount_amount DECIMAL(12,2) DEFAULT 0;
  DECLARE v_message TEXT DEFAULT '';

  SELECT id, discount_type, discount_value, status
  INTO v_promotion_id, v_discount_type, v_discount_value, v_status
  FROM promotions
  WHERE promo_code = p_promo_code
  LIMIT 1;

  SELECT COALESCE(SUM(j.unit_price * j.quantity), 0)
  INTO v_subtotal
  FROM JSON_TABLE(p_items_json, '$[*]' COLUMNS(
    menu_item_id BIGINT PATH '$.menuItemId',
    item_name VARCHAR(200) PATH '$.itemName',
    unit_price DECIMAL(10,2) PATH '$.unitPrice',
    quantity INT PATH '$.quantity'
  )) AS j;

  IF v_promotion_id IS NULL OR v_status <> 'active' THEN
    SET v_discount_amount = 0;
    SET v_message = 'Mã khuyến mãi không hợp lệ.';
  ELSE
    IF v_discount_type = 'percentage' THEN
      SET v_discount_amount = ROUND(v_subtotal * v_discount_value / 100);
    ELSE
      SET v_discount_amount = LEAST(v_subtotal, v_discount_value);
    END IF;
    SET v_message = '';
  END IF;

  SELECT v_discount_amount AS discount_amount, v_message AS message, v_promotion_id AS promotion_id;
END$$

CREATE PROCEDURE sp_get_cities()
BEGIN
  SELECT id, slug, name
  FROM cities
  WHERE is_active = 1
  ORDER BY name ASC, id ASC;
END$$

CREATE PROCEDURE sp_get_districts(IN p_city_slug VARCHAR(100))
BEGIN
  SELECT d.id, d.slug, d.name, c.slug AS city_slug
  FROM districts d
  INNER JOIN cities c ON c.id = d.city_id
  WHERE d.is_active = 1
    AND c.is_active = 1
    AND (p_city_slug IS NULL OR p_city_slug = '' OR c.slug = p_city_slug)
  ORDER BY c.name ASC, d.name ASC;
END$$

CREATE PROCEDURE sp_get_stores(IN p_city_slug VARCHAR(100), IN p_district_slug VARCHAR(100))
BEGIN
  SELECT
    s.id,
    s.name,
    s.address_line,
    s.phone,
    s.opening_hours,
    s.map_url,
    c.name AS city_name,
    d.name AS district_name
  FROM stores s
  INNER JOIN districts d ON d.id = s.district_id
  INNER JOIN cities c ON c.id = d.city_id
  WHERE s.is_active = 1
    AND (p_city_slug IS NULL OR p_city_slug = '' OR c.slug = p_city_slug)
    AND (p_district_slug IS NULL OR p_district_slug = '' OR d.slug = p_district_slug)
  ORDER BY c.name ASC, d.name ASC, s.name ASC;
END$$

CREATE PROCEDURE sp_get_open_jobs()
BEGIN
  SELECT id, title, employment_type, salary_min, salary_max, salary_text, description, location_text
  FROM job_openings
  WHERE status = 'open'
  ORDER BY created_at DESC, id DESC;
END$$

CREATE PROCEDURE sp_create_contact_message(
  IN p_name VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_phone VARCHAR(20),
  IN p_subject VARCHAR(255),
  IN p_message TEXT
)
BEGIN
  INSERT INTO contact_messages (name, email, phone, subject, message)
  VALUES (p_name, p_email, p_phone, p_subject, p_message);

  SELECT LAST_INSERT_ID() AS insert_id;
END$$

CREATE PROCEDURE sp_create_user(
  IN p_full_name VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_phone VARCHAR(20),
  IN p_password VARCHAR(255)
)
BEGIN
  INSERT INTO users (full_name, email, phone, password_hash, role)
  VALUES (p_full_name, p_email, p_phone, SHA2(p_password, 256), 'customer');

  SELECT LAST_INSERT_ID() AS insert_id;
END$$

CREATE PROCEDURE sp_authenticate_user(IN p_email VARCHAR(150), IN p_password VARCHAR(255))
BEGIN
  SELECT id, full_name, email, phone, role, store_id, status, created_at
  FROM users
  WHERE email = p_email
    AND password_hash = SHA2(p_password, 256)
    AND status = 'active'
  LIMIT 1;
END$$

CREATE PROCEDURE sp_get_user_by_id(IN p_user_id BIGINT UNSIGNED)
BEGIN
  SELECT id, full_name, email, phone, role, store_id, status, created_at
  FROM users
  WHERE id = p_user_id
  LIMIT 1;
END$$

CREATE PROCEDURE sp_get_user_by_email(IN p_email VARCHAR(150))
BEGIN
  SELECT id, full_name, email, phone, role, store_id, status, created_at
  FROM users
  WHERE email = p_email
  LIMIT 1;
END$$

CREATE PROCEDURE sp_get_store_by_id(IN p_store_id BIGINT UNSIGNED)
BEGIN
  SELECT
    s.id,
    s.name,
    s.address_line,
    s.phone,
    s.opening_hours,
    s.map_url,
    c.name AS city_name,
    d.name AS district_name
  FROM stores s
  INNER JOIN districts d ON d.id = s.district_id
  INNER JOIN cities c ON c.id = d.city_id
  WHERE s.id = p_store_id
  LIMIT 1;
END$$

CREATE PROCEDURE sp_create_order(
  IN p_user_id BIGINT UNSIGNED,
  IN p_store_id BIGINT UNSIGNED,
  IN p_customer_name VARCHAR(150),
  IN p_customer_email VARCHAR(150),
  IN p_customer_phone VARCHAR(20),
  IN p_promotion_code VARCHAR(100),
  IN p_notes TEXT,
  IN p_discount_amount DECIMAL(12, 2),
  IN p_items_json JSON
)
BEGIN
  DECLARE v_store_exists TINYINT DEFAULT 0;
  DECLARE v_last_number BIGINT UNSIGNED DEFAULT 0;
  DECLARE v_store_order_number BIGINT UNSIGNED DEFAULT 0;
  DECLARE v_order_id BIGINT UNSIGNED DEFAULT 0;
  DECLARE v_subtotal_amount DECIMAL(12, 2) DEFAULT 0;
  DECLARE v_total_amount DECIMAL(12, 2) DEFAULT 0;
  DECLARE v_missing_items INT DEFAULT 0;
  DECLARE v_insufficient_items INT DEFAULT 0;
  DECLARE v_rows_updated INT DEFAULT 0;
  DECLARE v_expected_count INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  SELECT COUNT(*) INTO v_store_exists
  FROM stores
  WHERE id = p_store_id;

  IF v_store_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Shop đã nghỉ rùi nè, chọn shop khác đi bạn ơi';
  END IF;

  START TRANSACTION;

  INSERT INTO order_sequences (store_id, last_number)
  VALUES (p_store_id, 0)
  ON DUPLICATE KEY UPDATE last_number = last_number;

  SELECT last_number
  INTO v_last_number
  FROM order_sequences
  WHERE store_id = p_store_id
  FOR UPDATE;

  IF v_last_number = 0 THEN
    SELECT COALESCE(MAX(store_order_number), 0)
    INTO v_last_number
    FROM orders
    WHERE store_id = p_store_id;

    UPDATE order_sequences
    SET last_number = v_last_number
    WHERE store_id = p_store_id;
  END IF;

  SET v_store_order_number = v_last_number + 1;

  UPDATE order_sequences
  SET last_number = v_store_order_number
  WHERE store_id = p_store_id;

  SELECT COALESCE(SUM(j.unit_price * j.quantity), 0)
  INTO v_subtotal_amount
  FROM JSON_TABLE(p_items_json, '$[*]' COLUMNS(
    menu_item_id BIGINT PATH '$.menuItemId',
    item_name VARCHAR(200) PATH '$.itemName',
    unit_price DECIMAL(10, 2) PATH '$.unitPrice',
    quantity INT PATH '$.quantity'
  )) AS j;

  SET v_total_amount = GREATEST(v_subtotal_amount - COALESCE(p_discount_amount, 0), 0);

  DROP TEMPORARY TABLE IF EXISTS tmp_items;
  CREATE TEMPORARY TABLE tmp_items AS
  SELECT menu_item_id, SUM(quantity) AS qty
  FROM JSON_TABLE(p_items_json, '$[*]' COLUMNS(
    menu_item_id BIGINT PATH '$.menuItemId',
    quantity INT PATH '$.quantity'
  )) AS j
  GROUP BY menu_item_id;

  SELECT COUNT(*) INTO v_missing_items
  FROM tmp_items t
  LEFT JOIN menu_items m ON m.id = t.menu_item_id
  WHERE m.id IS NULL;

  IF v_missing_items > 0 THEN
    DROP TEMPORARY TABLE IF EXISTS tmp_items;
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Một hoặc nhiều món trong đơn hàng không tồn tại';
  END IF;

  UPDATE menu_items m
  JOIN tmp_items t ON m.id = t.menu_item_id
  SET m.stock = m.stock - t.qty
  WHERE m.stock >= t.qty;

  SET v_rows_updated = ROW_COUNT();
  SELECT COUNT(*) INTO v_expected_count FROM tmp_items;

  IF v_rows_updated <> v_expected_count THEN
    DROP TEMPORARY TABLE IF EXISTS tmp_items;
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Món này đã hết hàng';
  END IF;

  DROP TEMPORARY TABLE IF EXISTS tmp_items;

  INSERT INTO orders (
    store_order_number,
    user_id,
    store_id,
    customer_name,
    customer_email,
    customer_phone,
    promotion_code,
    notes,
    subtotal_amount,
    discount_amount,
    total_amount,
    status
  ) VALUES (
    v_store_order_number,
    p_user_id,
    p_store_id,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_promotion_code,
    p_notes,
    v_subtotal_amount,
    COALESCE(p_discount_amount, 0),
    v_total_amount,
    'pending'
  );

  SET v_order_id = LAST_INSERT_ID();

  INSERT INTO order_items (
    order_id,
    menu_item_id,
    item_name,
    unit_price,
    quantity,
    line_total
  )
  SELECT
    v_order_id,
    j.menu_item_id,
    j.item_name,
    j.unit_price,
    j.quantity,
    j.unit_price * j.quantity
  FROM JSON_TABLE(p_items_json, '$[*]' COLUMNS(
    menu_item_id BIGINT PATH '$.menuItemId',
    item_name VARCHAR(200) PATH '$.itemName',
    unit_price DECIMAL(10, 2) PATH '$.unitPrice',
    quantity INT PATH '$.quantity'
  )) AS j;

  COMMIT;

  SELECT v_order_id AS order_id, v_store_order_number AS store_order_number;
END$$

CREATE PROCEDURE sp_has_promotion_usage(
  IN p_promotion_id BIGINT UNSIGNED,
  IN p_user_id BIGINT UNSIGNED,
  IN p_customer_email VARCHAR(150)
)
BEGIN
  IF p_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1
      FROM promotion_usages
      WHERE promotion_id = p_promotion_id AND user_id = p_user_id
      LIMIT 1
    ) AS used;
  ELSEIF p_customer_email IS NOT NULL AND p_customer_email <> '' THEN
    SELECT EXISTS(
      SELECT 1
      FROM promotion_usages
      WHERE promotion_id = p_promotion_id AND customer_email = p_customer_email
      LIMIT 1
    ) AS used;
  ELSE
    SELECT 0 AS used;
  END IF;
END$$

CREATE PROCEDURE sp_record_promotion_usage(
  IN p_promotion_id BIGINT UNSIGNED,
  IN p_user_id BIGINT UNSIGNED,
  IN p_customer_email VARCHAR(150),
  IN p_order_id BIGINT UNSIGNED
)
BEGIN
  INSERT INTO promotion_usages (promotion_id, user_id, customer_email, order_id)
  VALUES (p_promotion_id, p_user_id, p_customer_email, p_order_id);
END$$

CREATE PROCEDURE sp_get_orders_for_store(IN p_store_id BIGINT UNSIGNED)
BEGIN
  SELECT
    o.id,
    o.store_order_number,
    o.user_id,
    o.store_id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.promotion_code,
    o.notes,
    o.subtotal_amount,
    o.discount_amount,
    o.total_amount,
    o.status,
    o.created_at,
    o.updated_at,
    COALESCE(
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'menuItemId', oi.menu_item_id,
            'itemName', oi.item_name,
            'unitPrice', oi.unit_price,
            'quantity', oi.quantity,
            'lineTotal', oi.line_total
          )
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      ),
      JSON_ARRAY()
    ) AS items
  FROM orders o
  WHERE o.store_id = p_store_id
  ORDER BY o.created_at DESC, o.id DESC;
END$$

CREATE PROCEDURE sp_get_orders_for_customer(IN p_user_id BIGINT UNSIGNED, IN p_customer_email VARCHAR(150))
BEGIN
  SELECT
    o.id,
    o.store_order_number,
    o.user_id,
    o.store_id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.promotion_code,
    o.notes,
    o.subtotal_amount,
    o.discount_amount,
    o.total_amount,
    o.status,
    o.created_at,
    o.updated_at,
    COALESCE(
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'menuItemId', oi.menu_item_id,
            'itemName', oi.item_name,
            'unitPrice', oi.unit_price,
            'quantity', oi.quantity,
            'lineTotal', oi.line_total
          )
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      ),
      JSON_ARRAY()
    ) AS items
  FROM orders o
  WHERE (p_user_id IS NOT NULL AND o.user_id = p_user_id)
     OR (p_customer_email IS NOT NULL AND p_customer_email <> '' AND o.customer_email = p_customer_email)
  ORDER BY o.created_at DESC, o.id DESC;
END$$

CREATE PROCEDURE sp_update_order_status(IN p_order_id BIGINT UNSIGNED, IN p_status VARCHAR(20))
BEGIN
  UPDATE orders
  SET status = p_status,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_order_id;

  SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE PROCEDURE sp_clear_orders_for_store(IN p_store_id BIGINT UNSIGNED)
BEGIN
  DELETE FROM orders
  WHERE store_id = p_store_id;

  SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE PROCEDURE sp_get_store_cleanup_settings(IN p_store_id BIGINT UNSIGNED)
BEGIN
  SELECT store_id, auto_clear_period
  FROM store_settings
  WHERE store_id = p_store_id
  LIMIT 1;

  IF ROW_COUNT() = 0 THEN
    SELECT p_store_id AS store_id, 'manual' AS auto_clear_period;
  END IF;
END$$

CREATE PROCEDURE sp_update_store_cleanup_settings(IN p_store_id BIGINT UNSIGNED, IN p_auto_clear_period VARCHAR(20))
BEGIN
  INSERT INTO store_settings (store_id, auto_clear_period)
  VALUES (p_store_id, p_auto_clear_period)
  ON DUPLICATE KEY UPDATE auto_clear_period = VALUES(auto_clear_period), updated_at = CURRENT_TIMESTAMP;
END$$

CREATE PROCEDURE sp_cleanup_store_orders_before(IN p_store_id BIGINT UNSIGNED, IN p_before_date DATETIME)
BEGIN
  DELETE FROM orders
  WHERE store_id = p_store_id AND created_at < p_before_date;

  SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE PROCEDURE sp_get_order_status(IN p_order_id BIGINT UNSIGNED)
BEGIN
  SELECT
    o.id AS order_id,
    o.status AS order_status,
    o.store_id AS store_id,
    o.created_at AS created_at,
    COALESCE(s.is_active, 0) AS store_is_active
  FROM orders o
  LEFT JOIN stores s ON s.id = o.store_id
  WHERE o.id = p_order_id
  LIMIT 1;
END$$

DELIMITER ;
