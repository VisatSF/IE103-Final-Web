# Final-Web

`Final-Web` la mot du an web gom:

- Frontend: React + Vite
- Backend: Express
- Database: MySQL

Ung dung duoc cau hinh de chay local voi 2 tien trinh:

- Frontend tai `http://localhost:3000`
- API server tai `http://localhost:3001`

## 1. Yeu cau truoc khi chay

Can cai san:

- Node.js `20+`
- npm `10+`
- MySQL `8+`

De kiem tra:

```powershell
node -v
npm -v
mysql --version
```

## 2. Tai source code

Neu ban da clone repo, mo terminal va di chuyen vao dung thu muc project:

```powershell
cd C:\Users\Admin\Jobillee_Web\Final-Web
```

## 3. Cai dependencies

Chay lenh sau de cai cac goi can thiet:

```powershell
npm install
```

Sau khi cai xong, project moi co the chay `npm run dev`, `npm run server`, va `npm run build`.

## 4. Cau hinh database environment

Tao file `.env` cho database tu file mau:

```powershell
Copy-Item database\.env.example database\.env
```

Mo file `database/.env` va cap nhat thong tin theo may cua ban:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=jobillee_web
```

Neu backend can dung cong khac, ban co the them:

```env
API_PORT=3001
```

Neu khong khai bao `API_PORT`, server mac dinh dung cong `3001`.

## 5. Tao database va import du lieu mau

Dang nhap MySQL va chay cac lenh sau:

```sql
CREATE DATABASE jobillee_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobillee_web;
SOURCE schema.sql;
   SOURCE seed.sql;
   ```
   
   Luu y:
   
- Hai file `schema.sql` va `seed.sql` nam trong thu muc `database/`.
- Neu ban dang o MySQL command line, hay di chuyen vao thu muc `database` truoc hoac dung duong dan day du den 2 file SQL.

Vi du tren Windows:

```powershell
cd C:\Users\Admin\Jobillee_Web\Final-Web\database
mysql -u root -p
```

Sau do trong MySQL:

```sql
CREATE DATABASE jobillee_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobillee_web;
SOURCE schema.sql;
SOURCE seed.sql;
```

## 6. Chay backend

Mo terminal thu nhat trong thu muc `Final-Web` va chay:

```powershell
npm run server
```

Neu ket noi MySQL thanh cong, backend se chay tai:

```text
http://localhost:3001
```

Ban co the kiem tra nhanh API bang duong dan:

```text
http://localhost:3001/api/health
```

## 7. Chay frontend

Mo terminal thu hai trong cung thu muc `Final-Web` va chay:

```powershell
npm run dev
```

Sau do mo trinh duyet tai:

```text
http://localhost:3000
```

Frontend da duoc cau hinh proxy san, nen cac request `/api` se tu dong chuyen sang backend local `3001`.

## 8. Thu tu chay nhanh

Neu ban muon chay lai tu dau, hay lam theo dung thu tu nay:

1. Mo terminal trong `Final-Web`
2. Chay `npm install`
3. Tao file `database/.env`
4. Tao database `jobillee_web`
5. Import `schema.sql`
6. Import `seed.sql`
7. Chay `npm run server`
8. Chay `npm run dev`
9. Mo `http://localhost:3000`

## 9. Script co san

- `npm run dev`: chay frontend Vite o cong `3000`
- `npm run server`: chay Express API
- `npm run build`: build frontend ra thu muc `dist`
- `npm run preview`: preview ban build
- `npm run lint`: kiem tra lint

## 10. Neu project khong chay

Hay kiem tra lan luot:

- Ban da chay `npm install` chua
- MySQL da duoc bat chua
- File `database/.env` da dung user, password, va ten database chua
- Ban da import `schema.sql` va `seed.sql` chua
- Backend co dang chay o cong `3001` khong

Neu `http://localhost:3001/api/health` loi, thuong la do backend chua ket noi duoc MySQL.

## 11. Cau truc chinh cua project

- `src/`: frontend source code
- `server/`: Express API
- `database/`: file cau hinh va SQL
- `public/`: tai nguyen tinh

## 12. Ghi chu

- Thu muc `node_modules/` khong duoc dua len GitHub vi co the cai lai bang `npm install`
- File `.env` khong nen dua len GitHub vi co chua thong tin cau hinh may cuc bo
