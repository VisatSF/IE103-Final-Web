USE jobillee_web;

INSERT INTO cities (id, slug, name) VALUES
  (1, 'hcm', 'TP. Hồ Chí Minh'),
  (2, 'hn', 'Hà Nội'),
  (3, 'dn', 'Đà Nẵng'),
  (4, 'ct', 'Cần Thơ')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  is_active = 1;

INSERT INTO districts (id, city_id, slug, name) VALUES
  (1, 1, 'q1', 'Quận 1'),
  (2, 1, 'q3', 'Quận 3'),
  (3, 2, 'hk', 'Hoàn Kiếm'),
  (4, 2, 'cg', 'Cầu Giấy')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  is_active = 1;

INSERT INTO stores (district_id, name, address_line, phone, opening_hours, map_url, is_active) VALUES
  (1, 'Jobillee Nguyễn Huệ', '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '028-3822-1234', '8:00 - 22:00', NULL, 1),
  (1, 'Jobillee Lê Lợi', '65 Lê Lợi, Quận 1, TP. Hồ Chí Minh', '028-3822-5678', '8:00 - 22:00', NULL, 1),
  (2, 'Jobillee Võ Văn Tần', '234 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', '028-3933-4567', '8:00 - 22:00', NULL, 1),
  (3, 'Jobillee Hoàn Kiếm', '45 Tràng Tiền, Hoàn Kiếm, Hà Nội', '024-3826-1234', '8:00 - 22:00', NULL, 1),
  (4, 'Jobillee Cầu Giấy', '78 Xuân Thủy, Cầu Giấy, Hà Nội', '024-3754-5678', '8:00 - 22:00', NULL, 1);

INSERT INTO users (full_name, email, phone, password_hash, role, store_id, status) VALUES
  ('User 1', 'user1@gmail.com', '0901000001', SHA2('User1', 256), 'customer', NULL, 'active'),
  ('User 2', 'user2@gmail.com', '0901000002', SHA2('User2', 256), 'customer', NULL, 'active'),
  ('User 3', 'user3@gmail.com', '0901000003', SHA2('User3', 256), 'customer', NULL, 'active'),
  ('Quản lý Jobillee Nguyễn Huệ', 'store1@jobillee.vn', '02838221234', SHA2('Store1', 256), 'store_manager', 1, 'active'),
  ('Quản lý Jobillee Hoàn Kiếm', 'store2@jobillee.vn', '02438261234', SHA2('Store2', 256), 'store_manager', 4, 'active')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone = VALUES(phone),
  role = VALUES(role),
  store_id = VALUES(store_id),
  status = VALUES(status);

INSERT INTO menu_categories (id, slug, name, display_order) VALUES
  (1, 'combo-ban-chay', 'COMBO BÁN CHẠY', 1),
  (2, 'ga-gion', 'Gà Giòn Vui Vẻ', 2),
  (3, 'my-y', 'Mỳ Ý Sốt Bò Bằm', 3),
  (4, 'ga-cay', 'Gà Sốt Cay', 4),
  (5, 'burger', 'Burger', 5),
  (6, 'an-phu', 'Phần Ăn Phụ', 6),
  (7, 'trang-mieng', 'Tráng Miệng', 7),
  (8, 'thuc-uong', 'Thức Uống', 8)
ON DUPLICATE KEY UPDATE
  slug = VALUES(slug),
  name = VALUES(name),
  display_order = VALUES(display_order),
  is_active = 1;

INSERT INTO menu_items (category_id, slug, name, description, price, image_url, is_featured, display_order) VALUES
  (1, 'combo-mot-minh-an-ngon', 'Combo Một Mình Ăn Ngon', '1 miếng gà giòn + 1 mì ý sốt bò bằm', 78000, '/combo-mot-minh-an-ngon.jpg', 1, 1),
  (1, 'combo-cap-doi-an-y-1', 'Combo Cặp Đôi Ăn Ý 1', '2 miếng gà giòn + 2 mì ý sốt bò bằm', 145000, '/combo-cap-doi-an-y-1.jpg', 0, 2),
  (1, 'combo-cap-doi-an-y-2', 'Combo Cặp Đôi Ăn Ý 2', '3 miếng gà giòn + 1 mì ý sốt bò bằm', 145000, '/combo-cap-doi-an-y-2.jpg', 0, 3),
  (1, 'combo-ca-nha-no-ne', 'Combo Cả Nhà No Nê', '4 miếng gà giòn + 2 mì ý sốt bò bằm', 185000, '/combo-ca-nha-no-ne.jpg', 0, 4),
  (2, '1-mieng-ga-gion', '1 miếng gà giòn', '1 miếng gà giòn rụm', 30000, '/1-mieng-ga-gion.webp', 1, 1),
  (2, '2-mieng-ga-gion', '2 miếng gà giòn', '2 miếng gà giòn rụm', 60000, '/2-mieng-ga-gion.webp', 0, 2),
  (2, '4-mieng-ga-gion', '4 miếng gà giòn', '4 miếng gà giòn rụm', 116000, '/4-mieng-ga-gion.webp', 0, 3),
  (2, '6-mieng-ga-gion', '6 miếng gà giòn', '6 miếng gà giòn rụm', 174000, '/6-mieng-ga-gion.webp', 0, 4),
  (2, '2-ga-khoai-nuoc', '2 gà + khoai + nước', '2 miếng gà giòn + khoai tây vừa + nước ngọt thường', 80000, '/2-ga-khoai-nuoc.webp', 0, 5),
  (2, 'com-ga-sup-nuoc', 'Cơm gà + súp + nước', 'Cơm gà giòn + súp bí đỏ + nước ngọt', 50000, '/com-ga-sup-nuoc.webp', 0, 6),
  (2, '1-ga-khoai-nuoc', '1 gà + khoai + nước', '1 miếng gà giòn + khoai tây vừa + nước ngọt thường', 50000, '/1-ga-khoai-nuoc.webp', 0, 7),
  (3, 'my-y-sot-bo-bam-vua', 'Mỳ Ý sốt bò bằm (Vừa)', 'Mỳ Ý sốt bò bằm cỡ vừa', 30000, '/my-y-sot-bo-bam-vua.jpg', 1, 1),
  (3, 'my-y-sot-bo-bam-lon', 'Mỳ Ý sốt bò bằm (Lớn)', 'Mỳ Ý sốt bò bằm cỡ lớn', 40000, '/my-y-sot-bo-bam-lon.jpg', 0, 2),
  (3, 'ga-my-y-nuoc', 'Gà + Mỳ Ý + Nước', '1 miếng gà giòn vui vẻ + 1 mỳ ý sốt bò bằm + 1 nước ngọt', 65000, '/ga-my-y-nuoc.webp', 0, 3),
  (3, 'my-lon-2-ga-xl-khoai-nuoc', 'Mỳ lớn + 2 Gà XL + Khoai + Nước', 'Mỳ ý sốt bò bằm lớn + 2 miếng gà giòn không xương + khoai tây vừa + nước ngọt', 75000, '/my-lon-2-ga-xl-khoai-nuoc.jpg', 0, 4),
  (3, 'my-lon-2-ga-xl-nuoc', 'Mỳ lớn + 2 Gà XL + Nước', 'Mỳ ý sốt bò bằm lớn + 2 miếng gà không xương + nước ngọt', 65000, '/my-lon-2-ga-xl-nuoc.webp', 0, 5),
  (4, 'com-ga-sot-cay', 'Cơm gà sốt cay', '1 miếng gà sốt cay + cơm', 45000, '/com-ga-sot-cay.jpg', 1, 1),
  (4, '2-mieng-ga-sot-cay', '2 miếng gà sốt cay', '2 miếng gà sốt cay', 65000, '/2-mieng-ga-sot-cay.jpg', 0, 2),
  (4, '2-ga-cay-khoai-nuoc', '2 Gà cay + Khoai + Nước', '2 miếng gà sốt cay + khoai tây + pepsi thường', 90000, '/2-ga-cay-khoai-nuoc.jpg', 0, 3),
  (4, 'com-ga-cay-nuoc', 'Cơm gà cay + Nước', '1 miếng gà sốt cay + cơm + nước', 50000, '/com-ga-cay-nuoc.jpg', 0, 4),
  (4, 'com-ga-cay-sup-nuoc', 'Cơm gà cay + Súp + Nước', '1 cơm gà sốt cay + pepsi thường + súp bí đỏ', 55000, '/com-ga-cay-sup-nuoc.jpg', 0, 5),
  (4, '1-ga-cay-khoai-nuoc', '1 Gà cay + Khoai + Nước', '1 miếng gà sốt cay + khoai tây + pepsi thường', 55000, '/1-ga-cay-khoai-nuoc.jpg', 0, 6),
  (4, '1-mieng-ga-sot-cay', '1 miếng gà sốt cay', '1 miếng gà sốt cay', 35000, '/1-mieng-ga-sot-cay.jpg', 0, 7),
  (5, 'burger-ga-gion-nuoc', 'Burger gà giòn + nước', 'Burger gà giòn kèm nước ngọt', 35000, '/burger-ga-gion-nuoc.webp', 1, 1),
  (5, 'burger-bbq-khoai-nuoc', 'Burger BBQ + Khoai + Nước', 'Burger BBQ kèm khoai và nước', 50000, '/burger-bbq-khoai-nuoc.webp', 0, 2),
  (5, 'burger-bbq-nuoc', 'Burger BBQ + Nước', 'Burger BBQ kèm nước ngọt', 35000, '/burger-bbq-nuoc.webp', 0, 3),
  (5, 'burger-bbq', 'Burger BBQ', 'Burger BBQ đậm vị', 30000, '/burger-bbq.webp', 0, 4),
  (5, 'burger-ga-gion', 'Burger gà giòn', 'Burger gà giòn thơm ngon', 30000, '/burger-ga-gion.webp', 0, 5),
  (5, 'burger-ga-gion-khoai-nuoc', 'Burger gà giòn + Khoai + Nước', 'Burger gà giòn kèm khoai và nước', 50000, '/burger-ga-gion-khoai-nuoc.webp', 0, 6),
  (6, 'khoai-tay-chien-lon', 'Khoai tây chiên (Lớn)', 'Khoai tây chiên giòn rụm cỡ lớn', 25000, '/khoai-tay-chien-lon.jpg', 1, 1),
  (6, 'khoai-vien-rong-bien', 'Khoai viên rong biển', 'Khoai viên rong biển giòn ngon', 25000, '/khoai-vien-rong-bien.jpg', 0, 2),
  (6, 'khoai-tay-chien-vua', 'Khoai tây chiên (Vừa)', 'Khoai tây chiên giòn rụm cỡ vừa', 20000, '/khoai-tay-chien-vua.jpg', 0, 4),
  (7, 'banh-xoai-dao', 'Bánh xoài đào', 'Bánh xoài đào ngọt mát', 15000, '/banh-xoai-dao.webp', 1, 1),
  (7, 'tropical-sundae', 'Tropical Sundae', 'Sundae trái cây nhiệt đới', 20000, '/tropical-sundae.webp', 0, 2),
  (7, 'kem-sua-tuoi', 'Kem sữa tươi', 'Kem sữa tươi mát lạnh', 5000, '/kem-sua-tuoi.webp', 0, 4),
  (7, 'kem-socola', 'Kem socola', 'Kem socola béo ngậy', 7000, '/kem-socola.webp', 0, 5),
  (7, 'kem-vanilla', 'Kem Vanilla', 'Kem vanilla thơm ngon', 15000, '/kem-vanilla.webp', 0, 6),
  (8, 'pepsi-vua', 'Pepsi Vừa', 'Pepsi size vừa', 10000, '/pepsi-vua.webp', 1, 1),
  (8, '7up-vua', '7Up Vừa', '7Up size vừa', 10000, '/7up-vua.webp', 0, 2),
  (8, 'mirinda-vua', 'Mirinda Vừa', 'Mirinda size vừa', 10000, '/mirinda-vua.webp', 0, 3),
  (8, 'pepsi-lon', 'Pepsi Lớn', 'Pepsi size lớn', 15000, '/pepsi-lon.webp', 0, 4),
  (8, '7up-lon', '7Up Lớn', '7Up size lớn', 15000, '/7up-lon.webp', 0, 5)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  image_url = VALUES(image_url),
  is_featured = VALUES(is_featured),
  display_order = VALUES(display_order),
  is_active = 1;

INSERT INTO services (slug, title, description, icon_name, display_order, is_active) VALUES
  ('pickup', 'LẤY TẠI CỬA HÀNG', 'Đặt hàng trước qua app hoặc website, đến cửa hàng lấy ngay không cần chờ đợi.', 'Store', 1, 1),
  ('delivery', 'GIAO HÀNG TẬN NƠI', 'Dịch vụ giao hàng nhanh chóng trong vòng 30 phút.', 'Truck', 2, 1),
  ('birthday-party', 'ĐẶT TIỆC SINH NHẬT', 'Tổ chức tiệc sinh nhật với thực đơn đa dạng và không gian vui nhộn.', 'PartyPopper', 3, 1),
  ('kids-club', 'JOBILLEE KIDS CLUB', 'Câu lạc bộ dành cho trẻ em với nhiều hoạt động thú vị.', 'Users', 4, 1),
  ('bulk-order', 'ĐƠN HÀNG LỚN', 'Phục vụ đơn hàng lớn cho sự kiện, tiệc công ty và họp mặt.', 'ShoppingBag', 5, 1),
  ('pre-order', 'ĐẶT HÀNG TRƯỚC', 'Đặt hàng trước để đảm bảo có món ăn yêu thích vào giờ cao điểm.', 'Clock', 6, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  icon_name = VALUES(icon_name),
  display_order = VALUES(display_order),
  is_active = 1;

INSERT INTO news_posts (slug, title, summary, content, image_url, status, published_at) VALUES
  ('ra-mat-combo-gia-dinh-moi', 'Ra mắt combo gia đình mới - Tiết kiệm hơn, ngon hơn', 'Jobillee giới thiệu combo gia đình mới với giá ưu đãi đặc biệt.', 'Bao gồm 8 miếng gà rán, 2 phần khoai tây lớn, 2 nước ngọt và 1 món tráng miệng.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/069f4ea5fc086935a53944c08576d803.png', 'published', '2026-04-15 09:00:00'),
  ('khuyen-mai-thang-4', 'Khuyến mãi tháng 4 - Giảm giá lên đến 30%', 'Chào mừng tháng 4, Jobillee dành tặng khách hàng chương trình khuyến mãi hấp dẫn.', 'Giảm giá lên đến 30% cho các combo và món ăn yêu thích trong tháng 4.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/f08319569cfa954a05cad939a4079a2b.png', 'published', '2026-04-10 09:00:00'),
  ('khai-truong-cua-hang-thu-50', 'Khai trương cửa hàng thứ 50 tại Hà Nội', 'Jobillee chính thức khai trương cửa hàng thứ 50 tại số 123 Dương Lâng, Hà Nội.', 'Nhiều ưu đãi đặc biệt dành cho khách hàng trong tuần khai trương.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/284eca44fa6db807fc3fc627d9657ec5.png', 'published', '2026-04-05 09:00:00'),
  ('mon-moi-my-y-sot-bo-bam', 'Món mới: Mỳ Ý Sốt Bò Bằm - Hương vị Ý địch thực', 'Khám phá món mỳ Ý sốt bò bằm mới với công thức đặc biệt.', 'Kết hợp hương vị truyền thống Ý và khẩu vị người Việt.', 'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/0f7a44313a54339ff0ba16dd765eb263.png', 'published', '2026-04-01 09:00:00');

INSERT INTO promotions (title, slug, description, promo_code, discount_type, discount_value, icon_key, valid_from, valid_until, terms, status) VALUES
  ('Giảm 30% Combo Gia Đình', 'giam-30-combo-gia-dinh', 'Áp dụng cho tất cả combo gia đình từ 4 người trở lên', 'FAMILY30', 'percentage', 30, 'Percent', '2026-04-01', '2026-05-30', 'Mỗi mã khuyến mãi chỉ được sử dụng một lần cho mỗi đơn hàng.', 'active'),
  ('Mua 2 Tặng 1 Gà Rán', 'mua-2-tang-1-ga-ran', 'Mua 2 miếng gà rán tặng thêm 1 miếng cùng loại', 'CHICKEN2FOR1', 'fixed', 25000, 'Gift', '2026-04-01', '2026-05-25', 'Không áp dụng đồng thời nhiều chương trình khuyến mãi.', 'active'),
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
  ('Nhân viên phục vụ', 'nhan-vien-phuc-vu', 'TP. Hồ Chí Minh - Nhiều vị trí', 'Toàn thời gian', 7000000, 9000000, '7-9 triệu/tháng', 'Phục vụ khách hàng, đảm bảo chất lượng dịch vụ tốt nhất', 'open'),
  ('Đầu bếp', 'dau-bep', 'Hà Nội', 'Toàn thời gian', 12000000, 18000000, '12-18 triệu/tháng', 'Chế biến món ăn theo tiêu chuẩn, đảm bảo vệ sinh an toàn thực phẩm', 'open'),
  ('Quản lý cửa hàng', 'quan-ly-cua-hang', 'Đà Nẵng', 'Toàn thời gian', 15000000, 22000000, '15-22 triệu/tháng', 'Quản lý vận hành cửa hàng, đào tạo và phát triển đội ngũ', 'open'),
  ('Nhân viên giao hàng', 'nhan-vien-giao-hang', 'TP. Hồ Chí Minh', 'Bán thời gian', 6000000, 8000000, '6-8 triệu/tháng', 'Giao hàng nhanh chóng, đảm bảo chất lượng món ăn', 'open'),
  ('Marketing Executive', 'marketing-executive', 'TP. Hồ Chí Minh', 'Toàn thời gian', 10000000, 15000000, '10-15 triệu/tháng', 'Lập kế hoạch và triển khai các chiến dịch marketing', 'open'),
  ('Nhân viên kho', 'nhan-vien-kho', 'Cần Thơ', 'Toàn thời gian', 7000000, 10000000, '7-10 triệu/tháng', 'Quản lý kho, kiểm soát hàng hóa và nguyên vật liệu', 'open');

INSERT INTO orders (user_id, store_id, customer_name, customer_email, customer_phone, notes, total_amount, status) VALUES
  (1, 1, 'User 1', 'user1@gmail.com', '0901000001', 'Lay them tuong ot', 93000, 'pending');

INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total) VALUES
  (1, 1, 'Gà Giòn Vui Vẻ (2 miếng)', 45000, 1, 45000),
  (1, 18, 'Pepsi', 15000, 2, 30000),
  (1, 15, 'Bánh Táo', 18000, 1, 18000);
