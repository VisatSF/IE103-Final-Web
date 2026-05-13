CREATE DATABASE IF NOT EXISTS jobillee_web
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jobillee_web;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'store_manager', 'admin') NOT NULL DEFAULT 'customer',
  store_id BIGINT UNSIGNED NULL,
  status ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',
  email_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'resolved', 'spam') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_messages_status_created_at (status, created_at)
);

CREATE TABLE IF NOT EXISTS cities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cities_slug (slug)
);

CREATE TABLE IF NOT EXISTS districts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  city_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_districts_city_slug (city_id, slug),
  KEY idx_districts_city_id (city_id),
  CONSTRAINT fk_districts_city_id
    FOREIGN KEY (city_id) REFERENCES cities (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS stores (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  district_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  address_line VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  opening_hours VARCHAR(100) NULL,
  map_url VARCHAR(500) NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stores_district_id (district_id),
  KEY idx_stores_active_name (is_active, name),
  CONSTRAINT fk_stores_district_id
    FOREIGN KEY (district_id) REFERENCES districts (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_menu_categories_slug (slug)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(150) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500) NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_menu_items_slug (slug),
  KEY idx_menu_items_category_id (category_id),
  KEY idx_menu_items_category_active (category_id, is_active),
  KEY idx_menu_items_active_featured (is_active, is_featured),
  CONSTRAINT fk_menu_items_category_id
    FOREIGN KEY (category_id) REFERENCES menu_categories (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_slug (slug)
);

CREATE TABLE IF NOT EXISTS news_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NULL,
  content LONGTEXT NULL,
  image_url VARCHAR(500) NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_news_posts_slug (slug),
  KEY idx_news_posts_status_published_at (status, published_at)
);

CREATE TABLE IF NOT EXISTS promotions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  promo_code VARCHAR(100) NULL,
  discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'fixed',
  discount_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
  icon_key VARCHAR(50) NULL,
  valid_from DATE NULL,
  valid_until DATE NULL,
  terms TEXT NULL,
  status ENUM('draft', 'active', 'expired', 'archived') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_promotions_slug (slug),
  UNIQUE KEY uq_promotions_promo_code (promo_code),
  KEY idx_promotions_status_valid_until (status, valid_until)
);

CREATE TABLE IF NOT EXISTS promotion_usages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  customer_email VARCHAR(150) NULL,
  order_id BIGINT UNSIGNED NULL,
  used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_promotion_usages_promotion_id (promotion_id),
  KEY idx_promotion_usages_user_id (user_id),
  KEY idx_promotion_usages_order_id (order_id),
  KEY idx_promotion_usages_customer_email (customer_email),
  KEY idx_promotion_usages_promotion_user (promotion_id, user_id),
  CONSTRAINT fk_promotion_usages_promotion_id
    FOREIGN KEY (promotion_id) REFERENCES promotions (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_promotion_usages_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS store_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id BIGINT UNSIGNED NOT NULL,
  auto_clear_period ENUM('manual', 'day', 'week', 'month', 'year') NOT NULL DEFAULT 'manual',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_store_settings_store_id (store_id),
  CONSTRAINT fk_store_settings_store_id
    FOREIGN KEY (store_id) REFERENCES stores (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS job_openings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  location_text VARCHAR(200) NOT NULL,
  employment_type VARCHAR(100) NOT NULL,
  salary_min DECIMAL(12, 2) NULL,
  salary_max DECIMAL(12, 2) NULL,
  salary_text VARCHAR(100) NULL,
  description TEXT NOT NULL,
  requirements TEXT NULL,
  benefits TEXT NULL,
  status ENUM('draft', 'open', 'closed') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_job_openings_slug (slug),
  KEY idx_job_openings_status_created_at (status, created_at)
);

CREATE TABLE IF NOT EXISTS job_applications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_opening_id BIGINT UNSIGNED NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cv_url VARCHAR(500) NULL,
  cover_letter TEXT NULL,
  status ENUM('new', 'reviewing', 'interview', 'rejected', 'hired') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_job_applications_job_opening_id (job_opening_id),
  KEY idx_job_applications_status_created_at (status, created_at),
  CONSTRAINT fk_job_applications_job_opening_id
    FOREIGN KEY (job_opening_id) REFERENCES job_openings (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_order_number BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  store_id BIGINT UNSIGNED NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  promotion_code VARCHAR(100) NULL,
  notes TEXT NULL,
  subtotal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user_id (user_id),
  KEY idx_orders_store_id (store_id),
  KEY idx_orders_customer_email (customer_email),
  KEY idx_orders_status_created_at (status, created_at),
  KEY idx_orders_status_customer_email (status, customer_email),
  UNIQUE KEY uq_store_order_number (store_id, store_order_number),
  CONSTRAINT fk_orders_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_orders_store_id
    FOREIGN KEY (store_id) REFERENCES stores (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NULL,
  item_name VARCHAR(200) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  line_total DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order_id (order_id),
  KEY idx_order_items_menu_item_id (menu_item_id),
  CONSTRAINT fk_order_items_order_id
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_menu_item_id
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS order_sequences (
  store_id BIGINT UNSIGNED NOT NULL,
  last_number BIGINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (store_id),
  CONSTRAINT fk_order_sequences_store_id
    FOREIGN KEY (store_id) REFERENCES stores (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
