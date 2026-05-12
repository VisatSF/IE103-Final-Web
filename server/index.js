import express from 'express';
import cors from 'cors';
import { checkDatabaseConnection } from '../database/connection.js';
import {
  authenticateUser,
  cleanupStoreOrdersBefore,
  clearOrdersForStore,
  createOrder,
  createUser,
  getActivePromotions,
  getAllMenuItems,
  getCities,
  getDistricts,
  getMenuCategories,
  getOrdersForStore,
  getOrdersForCustomer,
  getOrderStatus,
  getPromotionByCode,
  getStoreById,
  getStoreCleanupSettings,
  getStores,
  getUserByEmail,
  hasPromotionUsage,
  recordPromotionUsage,
  updateOrderStatus,
  updateStoreCleanupSettings,
} from '../database/queries.js';
import { loadDatabaseEnv } from './loadDatabaseEnv.js';

loadDatabaseEnv();

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const allowedStatuses = new Set(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']);
const allowedCleanupPeriods = new Set(['manual', 'day', 'week', 'month', 'year']);

app.use(cors());
app.use(express.json());

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    storeId: user.store_id,
    createdAt: user.created_at,
  };
}

function getRetentionDate(period) {
  const now = new Date();
  const nextDate = new Date(now);

  if (period === 'day') nextDate.setDate(now.getDate() - 1);
  if (period === 'week') nextDate.setDate(now.getDate() - 7);
  if (period === 'month') nextDate.setMonth(now.getMonth() - 1);
  if (period === 'year') nextDate.setFullYear(now.getFullYear() - 1);

  return nextDate;
}

async function applyCleanupIfNeeded(storeId) {
  const settings = await getStoreCleanupSettings(storeId);
  const period = settings.auto_clear_period;

  if (!allowedCleanupPeriods.has(period) || period === 'manual') {
    return { removedCount: 0, period };
  }

  const removedCount = await cleanupStoreOrdersBefore(storeId, getRetentionDate(period));
  return { removedCount, period };
}

function computeDiscount(promotion, subtotalAmount) {
  if (!promotion) {
    return 0;
  }

  if (String(promotion.promo_code || '').trim().toUpperCase() === 'CHICKEN2FOR1') {
    return 0;
  }

  if (promotion.discount_type === 'percentage') {
    return Math.round((subtotalAmount * Number(promotion.discount_value)) / 100);
  }

  return Math.min(subtotalAmount, Number(promotion.discount_value));
}

function getPromotionOrderNote(promotion) {
  if (String(promotion?.promo_code || '').trim().toUpperCase() !== 'CHICKEN2FOR1') {
    return '';
  }

  return 'CHICKEN2FOR1: làm thêm 1 miếng gà cho phần này.';
}

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getPromotionValidationMessage(promotion, items, now = new Date()) {
  if (!promotion) {
    return '';
  }

  const promoCode = String(promotion.promo_code || '').trim().toUpperCase();
  const normalizedNames = (items || []).map((item) => normalizeText(item.itemName ?? item.name ?? ''));

  if (promoCode === 'FAMILY30') {
    const eligible = normalizedNames.length > 0 && normalizedNames.every((name) => name.includes('combo gia dinh'));
    return eligible ? '' : 'Mã FAMILY30 chỉ áp dụng cho Combo Gia Đình.';
  }

  if (promoCode === 'CHICKEN2FOR1') {
    const eligible = normalizedNames.length > 0 && normalizedNames.every((name) => name.includes('ga gion vui ve (2 mieng)'));
    return eligible ? '' : 'Mã CHICKEN2FOR1 chỉ áp dụng cho Gà Giòn Vui Vẻ (2 miếng).';
  }

  if (promoCode === 'MONDAY20') {
    return now.getDay() === 1 ? '' : 'Mã MONDAY20 chỉ áp dụng vào thứ 2.';
  }

  return '';
}

app.get('/api/health', async (_request, response) => {
  try {
    await checkDatabaseConnection();
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post('/api/auth/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await authenticateUser(email, password);

    if (!user) {
      return response.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    response.json({ user: sanitizeUser(user) });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/register', async (request, response) => {
  try {
    const { fullName, email, phone, password } = request.body;
    const existingUser = await getUserByEmail(email.trim().toLowerCase());

    if (existingUser) {
      return response.status(409).json({ message: 'Email này đã được đăng ký.' });
    }

    const userId = await createUser({
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      password,
    });

    const user = await authenticateUser(email.trim().toLowerCase(), password);
    response.status(201).json({ user: sanitizeUser(user), userId });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/menu', async (_request, response) => {
  try {
    const [categories, items] = await Promise.all([getMenuCategories(), getAllMenuItems()]);
    response.json({
      categories: categories.map((category) => ({
        id: category.slug,
        name: category.name,
      })),
      items: items.map((item) => ({
        id: item.id,
        categoryId: item.category_slug,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        imageUrl: item.image_url,
      })),
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/promotions', async (_request, response) => {
  try {
    const userId = Number(_request.query.userId || 0) || null;
    const email = String(_request.query.email || '').trim().toLowerCase();
    const promotions = await getActivePromotions();
    const filteredPromotions = [];

    for (const promotion of promotions) {
      if (userId || email) {
        const used = await hasPromotionUsage({
          promotionId: promotion.id,
          userId,
          customerEmail: userId ? null : email,
        });

        if (used) {
          continue;
        }
      }

      filteredPromotions.push(promotion);
    }

    response.json({
      promotions: filteredPromotions.map((promotion) => ({
        id: promotion.id,
        code: promotion.promo_code,
        title: promotion.title,
        description: promotion.description,
        discountType: promotion.discount_type,
        discountValue: Number(promotion.discount_value),
        iconKey: promotion.icon_key,
        validUntil: promotion.valid_until,
        terms: promotion.terms,
      })),
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/stores/meta', async (request, response) => {
  try {
    const citySlug = request.query.city || '';
    const [cities, districts] = await Promise.all([
      getCities(),
      getDistricts({ citySlug }),
    ]);

    response.json({
      cities: cities.map((city) => ({ slug: city.slug, name: city.name })),
      districts: districts.map((district) => ({
        slug: district.slug,
        name: district.name,
        citySlug: district.city_slug,
      })),
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/stores', async (request, response) => {
  try {
    const citySlug = request.query.city || '';
    const districtSlug = request.query.district || '';
    const stores = await getStores({
      citySlug: citySlug || undefined,
      districtSlug: districtSlug || undefined,
    });

    response.json({
      stores: stores.map((store) => ({
        id: store.id,
        name: store.name,
        address: store.address_line,
        phone: store.phone,
        hours: store.opening_hours,
        mapUrl: store.map_url,
        cityName: store.city_name,
        districtName: store.district_name,
      })),
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post('/api/orders', async (request, response) => {
  try {
    const {
      userId = null,
      customerName,
      customerEmail,
      customerPhone,
      storeId,
      notes = '',
      promotionCode = '',
      items = [],
    } = request.body;

    console.log('[POST /api/orders] incoming order request', {
      userId,
      storeId,
      customerEmail,
      customerPhone,
      promotionCode,
      itemCount: items.length,
      status: 'received',
    });

    const subtotalAmount = items.reduce(
      (sum, item) => sum + Number(item.unitPrice ?? item.price) * Number(item.quantity),
      0
    );

    let promotion = null;
    let discountAmount = 0;
    const normalizedPromotionCode = promotionCode.trim().toUpperCase();
    const normalizedEmail = customerEmail.trim().toLowerCase();

    if (normalizedPromotionCode) {
      promotion = await getPromotionByCode(normalizedPromotionCode);
      if (!promotion || promotion.status !== 'active') {
        return response.status(400).json({ message: 'Mã khuyến mãi không hợp lệ.' });
      }

      const used = await hasPromotionUsage({
        promotionId: promotion.id,
        userId: userId || null,
        customerEmail: userId ? null : normalizedEmail,
      });

      if (used) {
        return response.status(409).json({ message: 'Mã khuyến mãi này đã được sử dụng trước đó.' });
      }

      const promotionValidationMessage = getPromotionValidationMessage(promotion, items, new Date());
      if (promotionValidationMessage) {
        return response.status(400).json({ message: promotionValidationMessage });
      }

      discountAmount = computeDiscount(promotion, subtotalAmount);
    }

    const orderNotes = [notes, getPromotionOrderNote(promotion)].filter(Boolean).join('\n');

    const createResult = await createOrder({
      userId,
      storeId,
      customerName,
      customerEmail: normalizedEmail,
      customerPhone,
      promotionCode: promotion?.promo_code || null,
      notes: orderNotes,
      discountAmount,
      items: items.map((item) => ({
        menuItemId: item.menuItemId ?? item.id,
        itemName: item.itemName ?? item.name,
        unitPrice: Number(item.unitPrice ?? item.price),
        quantity: Number(item.quantity),
      })),
    });

    const orderId = createResult.orderId;
    const storeOrderNumber = createResult.storeOrderNumber;

    if (promotion) {
      await recordPromotionUsage({
        promotionId: promotion.id,
        userId: userId || null,
        customerEmail: userId ? null : normalizedEmail,
        orderId,
      });
    }

    console.log('[POST /api/orders] order created successfully', {
      orderId,
      storeOrderNumber,
      userId,
      storeId,
      customerEmail: normalizedEmail,
      discountAmount,
      totalAmount: Math.max(0, subtotalAmount - discountAmount),
    });

    response.status(201).json({
      orderId,
      storeOrderNumber,
      discountAmount,
      totalAmount: Math.max(0, subtotalAmount - discountAmount),
    });
  } catch (error) {
    console.error('[POST /api/orders] order creation failed', {
      message: error.message,
      stack: error.stack,
    });
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/orders', async (request, response) => {
  try {
    const userId = Number(request.query.userId || 0) || null;
    const email = String(request.query.email || '').trim().toLowerCase();

    if (!userId && !email) {
      return response.status(400).json({ message: 'Cần userId hoặc email để lấy lịch sử đơn hàng.' });
    }

    const orders = await getOrdersForCustomer({
      userId,
      customerEmail: email,
    });

    response.json({
      orders: orders.map((order) => ({
        id: order.id,
        storeOrderNumber: order.store_order_number,
        userId: order.user_id,
        storeId: order.store_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        promotionCode: order.promotion_code,
        notes: order.notes,
        subtotalAmount: Number(order.subtotal_amount),
        discountAmount: Number(order.discount_amount),
        totalAmount: Number(order.total_amount),
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: order.items,
      })),
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/store/dashboard/:storeId', async (request, response) => {
  try {
    const storeId = Number(request.params.storeId);
    const [store, orders, settings] = await Promise.all([
      getStoreById(storeId),
      getOrdersForStore(storeId),
      getStoreCleanupSettings(storeId),
    ]);

    const stats = {
      totalOrders: orders.length,
      pendingCount: orders.filter((order) => order.status === 'pending').length,
      activeCount: orders.filter((order) => ['confirmed', 'preparing', 'ready'].includes(order.status)).length,
      completedCount: orders.filter((order) => order.status === 'completed').length,
      revenue: orders.filter((order) => order.status === 'completed').reduce((sum, order) => sum + Number(order.total_amount), 0),
    };

    response.json({
      store: store ? {
        id: store.id,
        name: store.name,
        address: store.address_line,
        phone: store.phone,
        hours: store.opening_hours,
      } : null,
      settings: {
        autoClearPeriod: settings.auto_clear_period,
      },
      stats,
      orders: orders.map((order) => ({
        id: order.id,
        storeOrderNumber: order.store_order_number,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        promotionCode: order.promotion_code,
        notes: order.notes,
        subtotalAmount: Number(order.subtotal_amount),
        discountAmount: Number(order.discount_amount),
        totalAmount: Number(order.total_amount),
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: order.items,
      })),
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get('/api/orders/:orderId/status', async (request, response) => {
  try {
    const orderId = Number(request.params.orderId);
    if (!orderId) {
      return response.status(400).json({ message: 'OrderId không hợp lệ.' });
    }

    const status = await getOrderStatus(orderId);

    if (!status) {
      return response.status(404).json({ message: 'Đơn hàng không tìm thấy.' });
    }

    response.json({
      orderId: status.orderId,
      status: status.status,
      storeId: status.storeId,
      storeIsActive: status.storeIsActive,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.patch('/api/store/orders/:orderId/status', async (request, response) => {
  try {
    const orderId = Number(request.params.orderId);
    const { status } = request.body;

    if (!allowedStatuses.has(status)) {
      return response.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
    }

    await updateOrderStatus(orderId, status);
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.delete('/api/store/orders', async (request, response) => {
  try {
    const storeId = Number(request.query.storeId);
    const removedCount = await clearOrdersForStore(storeId);
    response.json({ removedCount });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.patch('/api/store/settings/:storeId', async (request, response) => {
  try {
    const storeId = Number(request.params.storeId);
    const { autoClearPeriod } = request.body;

    if (!allowedCleanupPeriods.has(autoClearPeriod)) {
      return response.status(400).json({ message: 'Chu kỳ tự động xóa không hợp lệ.' });
    }

    await updateStoreCleanupSettings(storeId, autoClearPeriod);
    const cleanupResult = await applyCleanupIfNeeded(storeId);
    response.json({
      autoClearPeriod,
      removedCount: cleanupResult.removedCount,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post('/api/store/cleanup/:storeId', async (request, response) => {
  try {
    const storeId = Number(request.params.storeId);
    const cleanupResult = await applyCleanupIfNeeded(storeId);
    response.json(cleanupResult);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.listen(port, async () => {
  try {
    await checkDatabaseConnection();
    console.log(`MySQL API server running at http://localhost:${port}`);
  } catch (error) {
    console.error(`MySQL API server started at http://localhost:${port} but database connection failed: ${error.message}`);
  }
});
