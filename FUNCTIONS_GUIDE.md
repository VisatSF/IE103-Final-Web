# Hướng dẫn Các Hàm trong Jobillee Web

Tài liệu này hướng dẫn chi tiết về tất cả các hàm được sử dụng trong ứng dụng Jobillee, phân chia theo chức năng cho **Customer** (Khách hàng) và **Store Manager** (Quản lý cửa hàng).

## Mục lục
1. [API Functions](#api-functions)
2. [Mock Database Functions](#mock-database-functions)
3. [Utility Functions](#utility-functions)
4. [Hooks](#hooks)

---

## API Functions

Các hàm này trong `src/lib/api.js` gọi backend API server. Tất cả đều là `async` và trả về Promise.

### Xác thực (Authentication)

#### `loginApi(payload)`
**Dùng bởi:** Customer, Store Manager  
**Mục đích:** Đăng nhập tài khoản  
**Parameter:**
```javascript
{
  email: string,        // Email đăng ký
  password: string      // Mật khẩu
}
```
**Trả về:**
```javascript
{
  user: {
    id: number,
    fullName: string,
    email: string,
    phone: string,
    role: 'customer' | 'store_manager' | 'admin',
    storeId: number | null,    // Chỉ có nếu là store_manager
    createdAt: string          // ISO datetime
  }
}
```
**Ví dụ:**
```javascript
const user = await loginApi({
  email: 'user1@gmail.com',
  password: 'User1'
});
```

#### `registerApi(payload)`
**Dùng bởi:** Customer  
**Mục đích:** Đăng ký tài khoản mới  
**Parameter:**
```javascript
{
  fullName: string,   // Tên đầy đủ
  email: string,      // Email (phải là email hợp lệ, không trùng)
  phone: string,      // Số điện thoại
  password: string    // Mật khẩu
}
```
**Trả về:** `{ user: {...}, userId: number }`

---

### Thực đơn & Sản phẩm (Menu & Items)

#### `getMenuApi()`
**Dùng bởi:** Customer  
**Mục đích:** Lấy toàn bộ thực đơn  
**Parameter:** Không có  
**Trả về:**
```javascript
{
  categories: [
    { id: string, name: string }  // Ví dụ: { id: 'chicken', name: 'Gà Rán' }
  ],
  items: [
    {
      id: number,
      categoryId: string,
      name: string,
      description: string,
      price: number          // Giá bằng VND
    }
  ]
}
```
**Ví dụ:**
```javascript
const menu = await getMenuApi();
console.log(menu.categories);  // Hiển thị danh sách danh mục
console.log(menu.items);       // Hiển thị danh sách món ăn
```

---

### Khuyến mãi (Promotions)

#### `getPromotionsApi({ userId = null, email = '' })`
**Dùng bởi:** Customer, Store  
**Mục đích:** Lấy danh sách khuyến mãi hiện hoạt  
**Parameter:**
```javascript
{
  userId: number | null,     // ID người dùng (nếu đã đăng nhập)
  email: string              // Email để kiểm tra đã dùng khuyến mãi chưa
}
```
**Trả về:**
```javascript
{
  promotions: [
    {
      id: number,
      code: string,                    // Ví dụ: 'FAMILY30'
      title: string,
      description: string,
      discountType: 'percentage' | 'fixed',
      discountValue: number,           // % hoặc số tiền (VND)
      iconKey: string,                 // Icon type
      validUntil: string,              // Ngày hết hạn
      terms: string                    // Điều khoản
    }
  ]
}
```

**Ví dụ:**
```javascript
// Lấy khuyến mãi khả dụng cho customer
const promos = await getPromotionsApi({
  userId: currentUser.id,
  email: currentUser.email
});
```

---

### Cửa hàng (Stores)

#### `getStoresMetaApi(city = '')`
**Dùng bởi:** Customer  
**Mục đích:** Lấy danh sách thành phố, quận huyện  
**Parameter:**
```javascript
{
  city: string  // Optional: lọc theo slug thành phố (ví dụ: 'hcm', 'hn')
}
```
**Trả về:**
```javascript
{
  cities: [
    { slug: string, name: string }     // Ví dụ: { slug: 'hcm', name: 'TP. Ho Chi Minh' }
  ],
  districts: [
    { slug: string, name: string, citySlug: string }
  ]
}
```

#### `getStoresApi({ city = '', district = '' })`
**Dùng bởi:** Customer  
**Mục đích:** Lấy danh sách cửa hàng (có thể lọc)  
**Parameter:**
```javascript
{
  city: string,       // Slug thành phố
  district: string    // Slug quận huyện
}
```
**Trả về:**
```javascript
{
  stores: [
    {
      id: number,
      name: string,
      address: string,
      phone: string,
      hours: string,      // Ví dụ: '8:00 - 22:00'
      city: string,
      district: string,
      mapUrl: string      // Link Google Maps
    }
  ]
}
```

---

### Đơn hàng (Orders)

#### `createOrderApi(payload)` ✅
**Dùng bởi:** Customer  
**Mục đích:** Tạo đơn hàng mới  
**Parameter:**
```javascript
{
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  storeId: number,
  notes: string,                    // Ghi chú cho cửa hàng (optional)
  items: [
    {
      menuItemId: number,
      quantity: number
    }
  ],
  promotionCode: string             // Mã khuyến mãi (optional)
}
```
**Trả về:**
```javascript
{
  orderId: number,
  totalAmount: number,              // Tổng tiền (VND)
  discountAmount: number,
  subtotalAmount: number
}
```

**Ví dụ:**
```javascript
const order = await createOrderApi({
  customerName: 'Nguyễn Văn A',
  customerEmail: 'a@gmail.com',
  customerPhone: '0901000001',
  storeId: 1,
  notes: 'Lấy thêm tương ớt',
  items: [
    { menuItemId: 1, quantity: 1 },
    { menuItemId: 18, quantity: 2 }
  ],
  promotionCode: 'FAMILY30'
});
```

---

### Store Manager APIs

#### `getStoreDashboardApi(storeId)`
**Dùng bởi:** Store Manager  
**Mục đích:** Lấy thông tin dashboard cửa hàng (tất cả đơn, thống kê)  
**Parameter:** `{ storeId: number }`  
**Trả về:**
```javascript
{
  store: {
    id: number,
    name: string,
    address: string,
    phone: string
  },
  orders: [
    {
      id: number,
      customerName: string,
      customerEmail: string,
      customerPhone: string,
      status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled',
      items: [
        {
          itemName: string,
          unitPrice: number,
          quantity: number,
          lineTotal: number
        }
      ],
      subtotalAmount: number,
      discountAmount: number,
      totalAmount: number,
      promotionCode: string | null,
      notes: string,
      createdAt: string
    }
  ],
  stats: {
    totalOrders: number,
    pendingCount: number,
    activeCount: number,            // confirmed + preparing + ready
    completedCount: number,
    revenue: number                 // Tổng doanh thu
  },
  settings: {
    autoClearPeriod: 'manual' | 'day' | 'week' | 'month' | 'year'
  }
}
```

#### `updateStoreOrderStatusApi(orderId, status)`
**Dùng bởi:** Store Manager  
**Mục đích:** Cập nhật trạng thái đơn hàng  
**Parameter:**
```javascript
{
  orderId: number,
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
}
```
**Trả về:** `{ success: true }`

#### `clearStoreOrdersApi(storeId)`
**Dùng bởi:** Store Manager  
**Mục đích:** Xóa tất cả đơn của cửa hàng  
**Parameter:** `{ storeId: number }`  
**Trả về:** `{ removedCount: number }`

#### `updateStoreCleanupSettingsApi(storeId, autoClearPeriod)`
**Dùng bởi:** Store Manager  
**Mục đích:** Cập nhật cài đặt tự động xóa danh sách đơn cũ  
**Parameter:**
```javascript
{
  storeId: number,
  autoClearPeriod: 'manual' | 'day' | 'week' | 'month' | 'year'
}
```
**Trả về:** `{ autoClearPeriod: string, removedCount: number }`

#### `runStoreCleanupApi(storeId)`
**Dùng bởi:** Store Manager  
**Mục đích:** Chạy ngay công việc dọn dẹp đơn cũ (tuỳ theo cài đặt)  
**Parameter:** `{ storeId: number }`  
**Trả về:** `{ removedCount: number, period: string }`

---

## Mock Database Functions

Các hàm này trong `src/lib/mockDatabase.js` làm việc với dữ liệu local (localStorage) khi backend chưa sẵn sàng.

### Phiên & Người dùng (Session & User)

#### `initializeMockDatabase()`
**Mục đích:** Khởi tạo database mock với dữ liệu mẫu  
**Trả về:** Database object  
**Ghi chú:** Thường được gọi khi app khởi động

#### `getCurrentSession()`
**Mục đích:** Lấy thông tin phiên hiện tại của người dùng  
**Trả về:**
```javascript
{
  userId: number,
  role: string,
  user: { ...user object },
  loggedInAt: string
} | null
```

#### `getCurrentUser()`
**Dùng bởi:** Customer, Store Manager  
**Mục đích:** Lấy thông tin người dùng đã đăng nhập  
**Trả về:** User object hoặc `null` nếu chưa đăng nhập  
**Ví dụ:**
```javascript
const user = getCurrentUser();
if (user && user.role === 'store_manager') {
  // Hiển thị Store Dashboard
}
```

#### `setCurrentUserSession(user)`
**Mục đích:** Thiết lập phiên người dùng (sau đăng nhập)  
**Parameter:** User object hoặc `null` để logout  
**Ghi chú:** Tự động gọi bởi `loginUser()` và `registerUser()`

#### `logoutUser()`
**Dùng bởi:** Customer, Store Manager  
**Mục đích:** Đăng xuất người dùng  
**Trả về:** Không có

#### `loginUser({ email, password })`
**Dùng bởi:** Customer, Store Manager  
**Mục đích:** Đăng nhập (sử dụng mock data)  
**Trả về:** Sanitized user object  
**Lỗi:** `"Email hoac mat khau khong dung."`

#### `registerUser({ fullName, email, phone, password })`
**Dùng bởi:** Customer  
**Mục đích:** Đăng ký tài khoản (sử dụng mock data)  
**Trả về:** Sanitized user object  
**Lỗi:** `"Email nay da duoc dang ky."`

---

### Cửa hàng (Store)

#### `getStoreById(storeId)`
**Mục đích:** Lấy thông tin chi tiết của một cửa hàng  
**Parameter:** `{ storeId: number }`  
**Trả về:** Store object hoặc `null`

#### `getCurrentStore()`
**Dùng bởi:** Store Manager  
**Mục đích:** Lấy cửa hàng của store manager hiện tại  
**Trả về:** Store object hoặc `null`

#### `getStoreCleanupSettings(storeId)`
**Dùng bởi:** Store Manager  
**Mục đích:** Lấy cài đặt tự động xóa danh sách của cửa hàng  
**Trả về:** `{ storeId: number, autoClearPeriod: string }`

#### `updateStoreCleanupSettings(storeId, autoClearPeriod)`
**Dùng bởi:** Store Manager  
**Mục đích:** Cập nhật cài đặt tự động xóa  
**Trả về:** Updated settings object

---

### Địa lý (Geography)

#### `getCities()`
**Mục đích:** Lấy danh sách tất cả thành phố  
**Trả về:** Array of `{ slug: string, name: string }`

#### `getDistrictsByCity(citySlug)`
**Mục đích:** Lấy quận huyện của một thành phố  
**Parameter:** `{ citySlug: string }` hoặc `'all'`  
**Trả về:** Array of districts

#### `getStores({ city = '', district = '' })`
**Mục đích:** Lấy danh sách cửa hàng (có thể lọc)  
**Trả về:** Array of store objects

---

### Thực đơn (Menu)

#### `getMenuCategories()`
**Mục đích:** Lấy tất cả danh mục thực đơn  
**Trả về:** Array of `{ id: string, name: string }`

#### `getMenuItemsByCategory(categoryId)`
**Mục đích:** Lấy tất cả món ăn trong một danh mục  
**Trả về:** Array of menu items

---

### Khuyến mãi (Promotions)

#### `getPromotions()`
**Mục đích:** Lấy tất cả khuyến mãi  
**Trả về:** Array of promotion objects

#### `getAvailablePromotions({ userId = null, email = '' })`
**Mục đích:** Lấy khuyến mãi chưa được sử dụng bởi người dùng  
**Trả về:** Array of available promotions

#### `getPromotionByCode(code)`
**Mục đích:** Tìm khuyến mãi bằng mã  
**Parameter:** `{ code: string }`  
**Trả về:** Promotion object hoặc `null`

#### `calculatePromotionDiscount(promotion, subtotal)`
**Mục đích:** Tính toán số tiền giảm  
**Parameter:**
```javascript
{
  promotion: { discountType, discountValue },
  subtotal: number                          // Tổng tiền gốc
}
```
**Trả về:** Số tiền giảm (VND)

---

### Đơn hàng (Orders)

#### `createOrder({ customerName, customerEmail, customerPhone, storeId, notes, items, promotionCode })`
**Dùng bởi:** Customer  
**Mục đích:** Tạo đơn hàng mới (dùng mock data)  
**Trả về:** Created order object  
**Lỗi:** Nếu items trống hoặc storeId không hợp lệ

---

## Utility Functions

### `cn(...inputs)` - `src/lib/utils.js`
**Mục đích:** Merge CSS classes (Tailwind + conditionals)  
**Dùng bởi:** Các component khi cần class names động  
**Ví dụ:**
```javascript
import { cn } from '@/lib/utils';

const buttonClass = cn(
  'px-4 py-2',
  isActive && 'bg-red-500',
  !isActive && 'bg-gray-300'
);
```

### `formatCurrency(amount)` - `src/lib/mockDatabase.js`
**Mục đích:** Định dạng số tiền thành chuỗi VND  
**Ví dụ:** `formatCurrency(45000)` → `"45.000 ₫"`

### `formatDateTime(isoString)` - `src/lib/mockDatabase.js`
**Mục đích:** Định dạng ISO datetime thành chuỗi Việt  
**Ví dụ:** `"2026-05-03T09:00:00.000Z"` → `"03/05/2026 16:00"`

---

## Hooks

### `useCurrentUser()` - `src/hooks/use-current-user.js`
**Mục đích:** Hook để lấy người dùng hiện tại + listen auth changes  
**Trả về:** `[currentUser, isLoading, isMounted]`  
**Ví dụ:**
```javascript
import { useCurrentUser } from '@/hooks/use-current-user';

function Dashboard() {
  const [currentUser, isLoading] = useCurrentUser();

  if (isLoading) return <div>Đang tải...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  return <div>Xin chào {currentUser.fullName}</div>;
}
```

### `useIsMobile()` - `src/hooks/use-mobile.jsx`
**Mục đích:** Hook để detect responsive breakpoint  
**Trả về:** `boolean` (true nếu mobile, false nếu desktop)  
**Ví dụ:**
```javascript
const isMobile = useIsMobile();
return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

### `useToast()` - `src/hooks/use-toast.js`
**Mục đích:** Hook để show toast notifications  
**Trả về:** Toast object với methods: `success()`, `error()`, `info()`  
**Ví dụ:**
```javascript
import { toast } from 'sonner';  // Thực tế sử dụng sonner library

toast.success('Đặt hàng thành công!');
toast.error('Có lỗi xảy ra.');
```

---

## Tóm tắt theo User Role

### 👤 Customer (Khách hàng)
| Chức năng | Hàm chính |
|-----------|----------|
| Đăng nhập/Đăng ký | `loginApi()`, `registerApi()` |
| Xem thực đơn | `getMenuApi()` |
| Xem khuyến mãi | `getPromotionsApi()` |
| Tìm cửa hàng | `getStoresApi()`, `getStoresMetaApi()` |
| Tạo đơn hàng | `createOrderApi()` |
| Lấy user info | `getCurrentUser()`, `useCurrentUser()` |

### 🏪 Store Manager (Quản lý cửa hàng)
| Chức năng | Hàm chính |
|-----------|----------|
| Đăng nhập | `loginApi()` |
| Xem dashboard | `getStoreDashboardApi()` |
| Cập nhật trạng thái đơn | `updateStoreOrderStatusApi()` |
| Dọn dẹp đơn cũ | `runStoreCleanupApi()`, `clearStoreOrdersApi()` |
| Cài đặt tự động xóa | `updateStoreCleanupSettingsApi()` |
| Lấy cửa hàng của mình | `getCurrentStore()` |

---

## Ghi chú kỹ thuật

- **Async/Await:** Tất cả API functions là async, cần `await` khi gọi
- **Error Handling:** Wrap trong try/catch để xử lý lỗi
- **Authentication:** Token/Session được lưu trong localStorage
- **Mock Data:** Dùng `mockDatabase.js` khi backend chưa sẵn
- **Real Backend:** Sử dụng `api.js` khi backend (`npm run server`) chạy

---

## Ví dụ End-to-End

### Quy trình Đặt hàng cho Customer
```javascript
// 1. Lấy thực đơn
const menu = await getMenuApi();

// 2. Chọn món + thêm vào giỏ (handle local state)
// ...

// 3. Lấy khuyến mãi khả dụng
const promos = await getPromotionsApi({
  userId: currentUser.id,
  email: currentUser.email
});

// 4. Tạo đơn hàng
const order = await createOrderApi({
  customerName: currentUser.fullName,
  customerEmail: currentUser.email,
  customerPhone: currentUser.phone,
  storeId: selectedStore.id,
  notes: 'Ghi chú tùy chỉnh',
  items: cartItems,
  promotionCode: selectedPromo?.code || ''
});

console.log('Đơn hàng được tạo:', order.orderId);
```

### Quy trình Quản lý Đơn hàng cho Store Manager
```javascript
// 1. Lấy dashboard khi vào trang
const dashboard = await getStoreDashboardApi(currentUser.storeId);
console.log('Thống kê:', dashboard.stats);

// 2. Cập nhật trạng thái đơn
await updateStoreOrderStatusApi(orderId, 'confirmed');

// 3. Chạy dọn dẹp theo cài đặt
const cleanup = await runStoreCleanupApi(currentUser.storeId);
console.log(`Đã dọn ${cleanup.removedCount} đơn cũ`);
```

---

**Cập nhật lần cuối:** May 3, 2026  
**Version:** 1.0
