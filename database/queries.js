import { getDatabasePool } from './connection.js';

export async function getMenuCategories() {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, slug, name, display_order
     FROM menu_categories
     WHERE is_active = 1
     ORDER BY display_order ASC, id ASC`
  );

  return rows;
}

export async function getAllMenuItems() {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT
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
     ORDER BY mc.display_order ASC, mi.display_order ASC, mi.id ASC`
  );

  return rows;
}

export async function getMenuItemsByCategory(categorySlug) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT mi.id, mi.name, mi.description, mi.price, mi.image_url, mc.slug AS category_slug
     FROM menu_items mi
     INNER JOIN menu_categories mc ON mc.id = mi.category_id
     WHERE mc.slug = ? AND mi.is_active = 1
     ORDER BY mi.display_order ASC, mi.id ASC`,
    [categorySlug]
  );

  return rows;
}

export async function getPublishedNews(limit = 10) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, slug, title, summary, content, image_url, published_at
     FROM news_posts
     WHERE status = 'published'
     ORDER BY published_at DESC, id DESC
     LIMIT ?`,
    [limit]
  );

  return rows;
}

export async function getActivePromotions() {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, title, description, promo_code, discount_type, discount_value, icon_key, valid_from, valid_until, terms
     FROM promotions
     WHERE status = 'active'
     ORDER BY COALESCE(valid_until, '2099-12-31') ASC, id DESC`
  );

  return rows;
}

export async function getPromotionByCode(promoCode) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, title, description, promo_code, discount_type, discount_value, icon_key, valid_from, valid_until, terms, status
     FROM promotions
     WHERE promo_code = ?
     LIMIT 1`,
    [promoCode]
  );

  return rows[0] || null;
}

export async function getCities() {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, slug, name
     FROM cities
     WHERE is_active = 1
     ORDER BY name ASC, id ASC`
  );

  return rows;
}

export async function getDistricts({ citySlug } = {}) {
  const db = getDatabasePool();
  const values = [];
  const conditions = ['d.is_active = 1', 'c.is_active = 1'];

  if (citySlug) {
    conditions.push('c.slug = ?');
    values.push(citySlug);
  }

  const [rows] = await db.query(
    `SELECT d.id, d.slug, d.name, c.slug AS city_slug
     FROM districts d
     INNER JOIN cities c ON c.id = d.city_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY c.name ASC, d.name ASC`,
    values
  );

  return rows;
}

export async function getStores({ citySlug, districtSlug } = {}) {
  const db = getDatabasePool();
  const conditions = ['s.is_active = 1'];
  const values = [];

  if (citySlug) {
    conditions.push('c.slug = ?');
    values.push(citySlug);
  }

  if (districtSlug) {
    conditions.push('d.slug = ?');
    values.push(districtSlug);
  }

  const [rows] = await db.query(
    `SELECT
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
     WHERE ${conditions.join(' AND ')}
     ORDER BY c.name ASC, d.name ASC, s.name ASC`,
    values
  );

  return rows;
}

export async function getOpenJobs() {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, title, employment_type, salary_min, salary_max, salary_text, description, location_text
     FROM job_openings
     WHERE status = 'open'
     ORDER BY created_at DESC, id DESC`
  );

  return rows;
}

export async function createContactMessage(payload) {
  const db = getDatabasePool();
  const { name, email, phone = null, subject, message } = payload;

  const [result] = await db.query(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, subject, message]
  );

  return result.insertId;
}

export async function createUser(payload) {
  const db = getDatabasePool();
  const { fullName, email, phone = null, password } = payload;

  const [result] = await db.query(
    `INSERT INTO users (full_name, email, phone, password_hash, role)
     VALUES (?, ?, ?, SHA2(?, 256), 'customer')`,
    [fullName, email, phone, password]
  );

  return result.insertId;
}

export async function authenticateUser(email, password) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, full_name, email, phone, role, store_id, status, created_at
     FROM users
     WHERE email = ? AND password_hash = SHA2(?, 256) AND status = 'active'
     LIMIT 1`,
    [email, password]
  );

  return rows[0] || null;
}

export async function getUserById(userId) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, full_name, email, phone, role, store_id, status, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

export async function getUserByEmail(email) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT id, full_name, email, phone, role, store_id, status, created_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

export async function getStoreById(storeId) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT
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
     WHERE s.id = ?
     LIMIT 1`,
    [storeId]
  );

  return rows[0] || null;
}

export async function createOrder(payload) {
  const db = getDatabasePool();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      userId = null,
      storeId,
      customerName,
      customerEmail,
      customerPhone,
      promotionCode = null,
      notes = null,
      items,
    } = payload;

    const subtotalAmount = items.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0);
    const discountAmount = Number(payload.discountAmount || 0);
    const totalAmount = Math.max(0, subtotalAmount - discountAmount);

    await connection.query(
      `INSERT INTO order_sequences (store_id, last_number) VALUES (?, 1)
       ON DUPLICATE KEY UPDATE last_number = last_number + 1`,
      [storeId]
    );

    const [seqRows] = await connection.query(
      `SELECT last_number FROM order_sequences WHERE store_id = ? FOR UPDATE LIMIT 1`,
      [storeId]
    );

    const storeOrderNumber = seqRows && seqRows[0] ? Number(seqRows[0].last_number) : null;

    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        store_order_number, user_id, store_id, customer_name, customer_email, customer_phone, promotion_code,
        notes, subtotal_amount, discount_amount, total_amount, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [storeOrderNumber, userId, storeId, customerName, customerEmail, customerPhone, promotionCode, notes, subtotalAmount, discountAmount, totalAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.menuItemId ?? null,
          item.itemName,
          item.unitPrice,
          item.quantity,
          Number(item.unitPrice) * Number(item.quantity),
        ]
      );
    }

    await connection.commit();
    return { orderId, storeOrderNumber };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function hasPromotionUsage({ promotionId, userId = null, customerEmail = null }) {
  const db = getDatabasePool();
  const conditions = ['promotion_id = ?'];
  const values = [promotionId];

  if (userId) {
    conditions.push('user_id = ?');
    values.push(userId);
  } else if (customerEmail) {
    conditions.push('customer_email = ?');
    values.push(customerEmail);
  } else {
    return false;
  }

  const [rows] = await db.query(
    `SELECT id
     FROM promotion_usages
     WHERE ${conditions.join(' AND ')}
     LIMIT 1`,
    values
  );

  return rows.length > 0;
}

export async function recordPromotionUsage({ promotionId, userId = null, customerEmail = null, orderId = null }) {
  const db = getDatabasePool();
  await db.query(
    `INSERT INTO promotion_usages (promotion_id, user_id, customer_email, order_id)
     VALUES (?, ?, ?, ?)`,
    [promotionId, userId, customerEmail, orderId]
  );
}

export async function getOrdersForStore(storeId) {
  const db = getDatabasePool();
  const [orders] = await db.query(
    `SELECT id, user_id, store_id, customer_name, customer_email, customer_phone, promotion_code,
            store_order_number, notes, subtotal_amount, discount_amount, total_amount, status, created_at, updated_at
     FROM orders
     WHERE store_id = ?
     ORDER BY created_at DESC, id DESC`,
    [storeId]
  );

  if (!orders.length) {
    return [];
  }

  const [items] = await db.query(
    `SELECT order_id, menu_item_id, item_name, unit_price, quantity, line_total
     FROM order_items
     WHERE order_id IN (${orders.map(() => '?').join(', ')})
     ORDER BY id ASC`,
    orders.map((order) => order.id)
  );

  return orders.map((order) => ({
    ...order,
    items: items
      .filter((item) => item.order_id === order.id)
      .map((item) => ({
        menuItemId: item.menu_item_id,
        itemName: item.item_name,
        unitPrice: Number(item.unit_price),
        quantity: item.quantity,
        lineTotal: Number(item.line_total),
      })),
  }));
}

export async function getOrdersForCustomer({ userId = null, customerEmail = '' } = {}) {
  const db = getDatabasePool();
  const conditions = [];
  const values = [];

  if (userId) {
    conditions.push('user_id = ?');
    values.push(userId);
  }

  if (customerEmail) {
    conditions.push('customer_email = ?');
    values.push(customerEmail);
  }

  if (!conditions.length) {
    return [];
  }

  const [orders] = await db.query(
    `SELECT id, user_id, store_id, customer_name, customer_email, customer_phone, promotion_code,
            store_order_number, notes, subtotal_amount, discount_amount, total_amount, status, created_at, updated_at
     FROM orders
     WHERE ${conditions.length > 1 ? `(${conditions.join(' OR ')})` : conditions[0]}
     ORDER BY created_at DESC, id DESC`,
    values
  );

  if (!orders.length) {
    return [];
  }

  const [items] = await db.query(
    `SELECT order_id, menu_item_id, item_name, unit_price, quantity, line_total
     FROM order_items
     WHERE order_id IN (${orders.map(() => '?').join(', ')})
     ORDER BY id ASC`,
    orders.map((order) => order.id)
  );

  return orders.map((order) => ({
    ...order,
    items: items
      .filter((item) => item.order_id === order.id)
      .map((item) => ({
        menuItemId: item.menu_item_id,
        itemName: item.item_name,
        unitPrice: Number(item.unit_price),
        quantity: item.quantity,
        lineTotal: Number(item.line_total),
      })),
  }));
}

export async function updateOrderStatus(orderId, status) {
  const db = getDatabasePool();
  await db.query(
    `UPDATE orders
     SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, orderId]
  );
}

export async function clearOrdersForStore(storeId) {
  const db = getDatabasePool();
  const [result] = await db.query(
    `DELETE FROM orders
     WHERE store_id = ?`,
    [storeId]
  );

  return result.affectedRows;
}

export async function getStoreCleanupSettings(storeId) {
  const db = getDatabasePool();
  const [rows] = await db.query(
    `SELECT store_id, auto_clear_period
     FROM store_settings
     WHERE store_id = ?
     LIMIT 1`,
    [storeId]
  );

  return rows[0] || { store_id: storeId, auto_clear_period: 'manual' };
}

export async function updateStoreCleanupSettings(storeId, autoClearPeriod) {
  const db = getDatabasePool();
  await db.query(
    `INSERT INTO store_settings (store_id, auto_clear_period)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE auto_clear_period = VALUES(auto_clear_period), updated_at = CURRENT_TIMESTAMP`,
    [storeId, autoClearPeriod]
  );
}

export async function cleanupStoreOrdersBefore(storeId, beforeDate) {
  const db = getDatabasePool();
  const [result] = await db.query(
    `DELETE FROM orders
     WHERE store_id = ? AND created_at < ?`,
    [storeId, beforeDate]
  );

  return result.affectedRows;
}
