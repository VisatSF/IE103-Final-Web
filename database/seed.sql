USE jobillee_web;

INSERT INTO cities (id, slug, name) VALUES
  (1, 'hcm', 'TP. Ho Chi Minh'),
  (2, 'hn', 'Ha Noi'),
  (3, 'dn', 'Da Nang'),
  (4, 'ct', 'Can Tho')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  is_active = 1;

INSERT INTO districts (id, city_id, slug, name) VALUES
  (1, 1, 'q1', 'Quan 1'),
  (2, 1, 'q3', 'Quan 3'),
  (3, 2, 'hk', 'Hoan Kiem'),
  (4, 2, 'cg', 'Cau Giay')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  is_active = 1;

INSERT INTO stores (district_id, name, address_line, phone, opening_hours, map_url, is_active) VALUES
  (1, 'Jobillee Nguyen Hue', '123 Nguyen Hue, Quan 1, TP.HCM', '028-3822-1234', '8:00 - 22:00', NULL, 1),
  (1, 'Jobillee Le Loi', '65 Le Loi, Quan 1, TP.HCM', '028-3822-5678', '8:00 - 22:00', NULL, 1),
  (2, 'Jobillee Vo Van Tan', '234 Vo Van Tan, Quan 3, TP.HCM', '028-3933-4567', '8:00 - 22:00', NULL, 1),
  (3, 'Jobillee Hoan Kiem', '45 Trang Tien, Hoan Kiem, Ha Noi', '024-3826-1234', '8:00 - 22:00', NULL, 1),
  (4, 'Jobillee Cau Giay', '78 Xuan Thuy, Cau Giay, Ha Noi', '024-3754-5678', '8:00 - 22:00', NULL, 1);

INSERT INTO users (full_name, email, phone, password_hash, role, store_id, status) VALUES
  ('User 1', 'user1@gmail.com', '0901000001', SHA2('User1', 256), 'customer', NULL, 'active'),
  ('User 2', 'user2@gmail.com', '0901000002', SHA2('User2', 256), 'customer', NULL, 'active'),
  ('User 3', 'user3@gmail.com', '0901000003', SHA2('User3', 256), 'customer', NULL, 'active'),
  ('Quan ly Jobillee Nguyen Hue', 'store1@jobillee.vn', '02838221234', SHA2('Store1', 256), 'store_manager', 1, 'active'),
  ('Quan ly Jobillee Hoan Kiem', 'store2@jobillee.vn', '02438261234', SHA2('Store2', 256), 'store_manager', 4, 'active')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone = VALUES(phone),
  role = VALUES(role),
  store_id = VALUES(store_id),
  status = VALUES(status);

INSERT INTO menu_categories (id, slug, name, display_order) VALUES
  (1, 'chicken', 'Gà Rán', 1),
  (2, 'pasta', 'Mỳ Ý', 2),
  (3, 'burger', 'Burger', 3),
  (4, 'sides', 'Món Phụ', 4),
  (5, 'dessert', 'Tráng Miệng', 5),
  (6, 'drinks', 'Đồ Uống', 6)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  display_order = VALUES(display_order),
  is_active = 1;

INSERT INTO menu_items (category_id, slug, name, description, price, is_featured, display_order) VALUES
  (1, 'ga-gion-vui-ve-2-mieng', 'Gà Giòn Vui Vẻ (2 miếng)', 'Gà rán giòn tan với công thức độc quyền', 45000, 1, 1),
  (1, 'ga-gion-vui-ve-4-mieng', 'Gà Giòn Vui Vẻ (4 miếng)', 'Combo 4 miếng gà rán giòn ngon', 85000, 0, 2),
  (1, 'ga-sot-cay', 'Gà Sốt Cay', 'Gà rán phủ sốt cay đặc biệt', 52000, 1, 3),
  (1, 'ga-sot-bbq', 'Gà Sốt BBQ', 'Gà rán phủ sốt BBQ thơm ngon', 52000, 0, 4),
  (1, 'combo-gia-dinh', 'Combo Gia Đình', '8 miếng gà + 2 khoai tây + 2 nước ngọt', 189000, 1, 5),
  (2, 'my-y-sot-bo-bam', 'Mỳ Ý Sốt Bò Bằm', 'Mỳ Ý sốt cà chua với bò bằm thơm ngon', 42000, 1, 1),
  (2, 'my-y-sot-kem', 'Mỳ Ý Sốt Kem', 'Mỳ Ý sốt kem béo ngậy', 42000, 0, 2),
  (2, 'my-y-hai-san', 'Mỳ Ý Hải Sản', 'Mỳ Ý với hải sản tươi ngon', 55000, 0, 3),
  (3, 'burger-ga-gion', 'Burger Gà Giòn', 'Burger với gà rán giòn tan', 38000, 0, 1),
  (3, 'burger-bo-pho-mai', 'Burger Bò Phô Mai', 'Burger bò với phô mai tan chảy', 45000, 0, 2),
  (3, 'burger-tom', 'Burger Tôm', 'Burger với tôm tươi ngon', 42000, 0, 3),
  (4, 'khoai-tay-chien', 'Khoai Tây Chiên', 'Khoai tây chiên giòn rụm', 25000, 0, 1),
  (4, 'ga-popcorn', 'Gà Popcorn', 'Gà viên nhỏ giòn tan', 32000, 0, 2),
  (4, 'salad-rau-cu', 'Salad Rau Củ', 'Salad rau củ tươi mát', 28000, 0, 3),
  (5, 'banh-tao', 'Bánh Táo', 'Bánh táo nướng thơm ngon', 18000, 0, 1),
  (5, 'kem-sundae', 'Kem Sundae', 'Kem vani với topping đa dạng', 15000, 0, 2),
  (5, 'banh-chocolate', 'Bánh Chocolate', 'Bánh chocolate tan chảy', 22000, 0, 3),
  (6, 'pepsi', 'Pepsi', 'Nước ngọt có ga', 15000, 0, 1),
  (6, 'tra-dao', 'Trà Đào', 'Trà đào cam sả', 18000, 0, 2),
  (6, 'nuoc-cam', 'Nước Cam', 'Nước cam tươi', 20000, 0, 3)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  is_featured = VALUES(is_featured),
  display_order = VALUES(display_order),
  is_active = 1;

INSERT INTO services (slug, title, description, icon_name, display_order, is_active) VALUES
  ('pickup', 'LAY TAI CUA HANG', 'Dat hang truoc qua app hoac website, den cua hang lay ngay khong can cho doi.', 'Store', 1, 1),
  ('delivery', 'GIAO HANG TAN NOI', 'Dich vu giao hang nhanh chong trong vong 30 phut.', 'Truck', 2, 1),
  ('birthday-party', 'DAT TIEC SINH NHAT', 'To chuc tiec sinh nhat voi thuc don da dang va khong gian vui nhon.', 'PartyPopper', 3, 1),
  ('kids-club', 'JOBILLEE KIDS CLUB', 'Cau lac bo danh cho tre em voi nhieu hoat dong thu vi.', 'Users', 4, 1),
  ('bulk-order', 'DON HANG LON', 'Phuc vu don hang lon cho su kien, tiec cong ty va hop mat.', 'ShoppingBag', 5, 1),
  ('pre-order', 'DAT HANG TRUOC', 'Dat hang truoc de dam bao co mon an yeu thich vao gio cao diem.', 'Clock', 6, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  icon_name = VALUES(icon_name),
  display_order = VALUES(display_order),
  is_active = 1;

INSERT INTO news_posts (slug, title, summary, content, image_url, status, published_at) VALUES
  ('ra-mat-combo-gia-dinh-moi', 'Ra mat combo gia dinh moi - Tiet kiem hon, ngon hon', 'Jobillee gioi thieu combo gia dinh moi voi gia uu dai dac biet.', 'Bao gom 8 mieng ga ran, 2 phan khoai tay lon, 2 nuoc ngot va 1 mon trang mieng.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/069f4ea5fc086935a53944c08576d803.png', 'published', '2026-04-15 09:00:00'),
  ('khuyen-mai-thang-4', 'Khuyen mai thang 4 - Giam gia len den 30%', 'Chao mung thang 4, Jobillee danh tang khach hang chuong trinh khuyen mai hap dan.', 'Giam gia len den 30% cho cac combo va mon an yeu thich trong thang 4.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/f08319569cfa954a05cad939a4079a2b.png', 'published', '2026-04-10 09:00:00'),
  ('khai-truong-cua-hang-thu-50', 'Khai truong cua hang thu 50 tai Ha Noi', 'Jobillee chinh thuc khai truong cua hang thu 50 tai so 123 Duong Lang, Ha Noi.', 'Nhieu uu dai dac biet danh cho khach hang trong tuan khai truong.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/284eca44fa6db807fc3fc627d9657ec5.png', 'published', '2026-04-05 09:00:00'),
  ('mon-moi-my-y-sot-bo-bam', 'Mon moi: My Y Sot Bo Bam - Huong vi Y dich thuc', 'Kham pha mon my Y sot bo bam moi voi cong thuc dac biet.', 'Ket hop huong vi truyen thong Y va khau vi nguoi Viet.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/0f7a44313a54339ff0ba16dd765eb263.png', 'published', '2026-04-01 09:00:00');

INSERT INTO promotions (title, slug, description, promo_code, discount_type, discount_value, icon_key, valid_from, valid_until, terms, status) VALUES
  ('Giảm 30% Combo Gia Đình', 'giam-30-combo-gia-dinh', 'Áp dụng cho tất cả combo gia đình từ 4 người trở lên', 'FAMILY30', 'percentage', 30, 'Percent', '2026-04-01', '2026-04-30', 'Mỗi mã khuyến mãi chỉ được sử dụng một lần cho mỗi đơn hàng.', 'active'),
  ('Mua 1 Tặng 1 Gà Rán', 'mua-1-tang-1-ga-ran', 'Mua 2 miếng gà rán tặng thêm 1 miếng cùng loại', 'CHICKEN2FOR1', 'fixed', 25000, 'Gift', '2026-04-01', '2026-04-25', 'Không áp dụng đồng thời nhiều chương trình khuyến mãi.', 'active'),
  ('Combo Sinh Viên 39K', 'combo-sinh-vien-39k', 'Giảm ngay cho đơn hàng sinh viên hợp lệ', 'STUDENT39', 'fixed', 39000, 'Star', '2026-04-01', '2026-05-31', 'Áp dụng tại cửa hàng tham gia chương trình.', 'active'),
  ('Thứ 2 Vui Vẻ', 'thu-2-vui-ve', 'Giảm 20% tất cả đơn hàng vào thứ 2 hàng tuần', 'MONDAY20', 'percentage', 20, 'Calendar', '2026-01-01', '2026-12-31', 'Áp dụng cho đơn hàng hợp lệ trong năm 2026.', 'active')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  discount_type = VALUES(discount_type),
  discount_value = VALUES(discount_value),
  icon_key = VALUES(icon_key),
  valid_from = VALUES(valid_from),
  valid_until = VALUES(valid_until),
  terms = VALUES(terms),
  status = VALUES(status);

INSERT INTO store_settings (store_id, auto_clear_period) VALUES
  (1, 'manual'),
  (4, 'manual')
ON DUPLICATE KEY UPDATE
  auto_clear_period = VALUES(auto_clear_period);

INSERT INTO job_openings (title, slug, location_text, employment_type, salary_min, salary_max, salary_text, description, status) VALUES
  ('Nhan vien phuc vu', 'nhan-vien-phuc-vu', 'TP.HCM - Nhieu vi tri', 'Toan thoi gian', 7000000, 9000000, '7-9 trieu/thang', 'Phuc vu khach hang, dam bao chat luong dich vu tot nhat', 'open'),
  ('Dau bep', 'dau-bep', 'Ha Noi', 'Toan thoi gian', 12000000, 18000000, '12-18 trieu/thang', 'Che bien mon an theo tieu chuan, dam bao ve sinh an toan thuc pham', 'open'),
  ('Quan ly cua hang', 'quan-ly-cua-hang', 'Da Nang', 'Toan thoi gian', 15000000, 22000000, '15-22 trieu/thang', 'Quan ly van hanh cua hang, dao tao va phat trien doi ngu', 'open'),
  ('Nhan vien giao hang', 'nhan-vien-giao-hang', 'TP.HCM', 'Ban thoi gian', 6000000, 8000000, '6-8 trieu/thang', 'Giao hang nhanh chong, dam bao chat luong mon an', 'open'),
  ('Marketing Executive', 'marketing-executive', 'TP.HCM', 'Toan thoi gian', 10000000, 15000000, '10-15 trieu/thang', 'Lap ke hoach va trien khai cac chien dich marketing', 'open'),
  ('Nhan vien kho', 'nhan-vien-kho', 'Can Tho', 'Toan thoi gian', 7000000, 10000000, '7-10 trieu/thang', 'Quan ly kho, kiem soat hang hoa va nguyen vat lieu', 'open');

INSERT INTO orders (user_id, store_id, customer_name, customer_email, customer_phone, notes, total_amount, status) VALUES
  (1, 1, 'User 1', 'user1@gmail.com', '0901000001', 'Lay them tuong ot', 93000, 'pending');

INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total) VALUES
  (1, 1, 'Gà Giòn Vui Vẻ (2 miếng)', 45000, 1, 45000),
  (1, 18, 'Pepsi', 15000, 2, 30000),
  (1, 15, 'Bánh Táo', 18000, 1, 18000);
