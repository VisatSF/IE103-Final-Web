# MySQL database for Jobillee Web

Thu muc nay chua bo MySQL co ban de tach du lieu dong ra khoi frontend.

## Thanh phan

- `schema.sql`: tao database, bang, khoa ngoai, index.
- `seed.sql`: du lieu mau phu hop voi noi dung website hien tai.
- `connection.js`: pool ket noi MySQL bang `mysql2/promise`.
- `queries.js`: cac ham query co san cho menu, tin tuc, khuyen mai, cua hang, tuyen dung, lien he, tai khoan.
- `.env.example`: bien moi truong mau.

## Cac bang chinh

- `users`: tai khoan dang nhap/dang ky.
- `orders`, `order_items`: don hang va danh sach mon trong don.
- `contact_messages`: form lien he.
- `cities`, `districts`, `stores`: bo loc va danh sach cua hang.
- `menu_categories`, `menu_items`: thuc don.
- `services`: dich vu hien thi tren website.
- `news_posts`: tin tuc.
- `promotions`: khuyen mai.
- `job_openings`, `job_applications`: tuyen dung va ung tuyen.

## Cach dung nhanh

1. Tao database va bang:

```sql
SOURCE schema.sql;
```

2. Nap du lieu mau:

```sql
SOURCE seed.sql;
```

3. Cai them package neu backend se dung file ket noi:

```bash
npm install mysql2
```

4. Tao file `.env` theo mau trong `.env.example`.

## Tai khoan seed san

- Khach hang: `user1@gmail.com / User1`
- Khach hang: `user2@gmail.com / User2`
- Khach hang: `user3@gmail.com / User3`
- Cua hang: `store1@jobillee.vn / Store1`
- Cua hang: `store2@jobillee.vn / Store2`

## Ghi chu

- Day la tang database/doc + helper cho backend. Frontend hien tai chua goi truc tiep vao MySQL.
- Neu ban muon, buoc tiep theo co the la minh noi cac trang React nay vao API/Express de doc du lieu that tu database.
