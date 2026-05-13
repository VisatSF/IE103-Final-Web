import { getDatabasePool } from './connection.js';

function buildCallSql(procedureName, paramCount) {
  const placeholders = paramCount > 0 ? Array.from({ length: paramCount }, () => '?').join(', ') : '';
  return `CALL ${procedureName}(${placeholders})`;
}

async function callProcedure(procedureName, params = []) {
  const db = getDatabasePool();
  const [resultSets] = await db.query(buildCallSql(procedureName, params.length), params);
  return Array.isArray(resultSets) ? resultSets : [];
}

function getProcedureRows(resultSets, index = 0) {
  const rowSets = resultSets.filter(Array.isArray);
  return rowSets[index] || [];
}

function getLastProcedureRows(resultSets) {
  const rowSets = resultSets.filter(Array.isArray);
  return rowSets[rowSets.length - 1] || [];
}

function parseJsonValue(value, fallback = []) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value == null || value === '') {
    return fallback;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function normalizeOrderRows(rows) {
  return rows.map((order) => ({
    ...order,
    items: parseJsonValue(order.items, []),
  }));
}

export async function getMenuCategories() {
  const resultSets = await callProcedure('sp_get_menu_categories');
  return getProcedureRows(resultSets);
}

export async function getAllMenuItems() {
  const resultSets = await callProcedure('sp_get_all_menu_items');
  return getProcedureRows(resultSets);
}

export async function getMenuItemsByCategory(categorySlug) {
  const resultSets = await callProcedure('sp_get_menu_items_by_category', [categorySlug]);
  return getProcedureRows(resultSets);
}

export async function getPublishedNews(limit = 10) {
  const resultSets = await callProcedure('sp_get_published_news', [limit]);
  return getProcedureRows(resultSets);
}

export async function getActivePromotions() {
  const resultSets = await callProcedure('sp_get_active_promotions');
  return getProcedureRows(resultSets);
}

export async function getPromotionByCode(promoCode) {
  const resultSets = await callProcedure('sp_get_promotion_by_code', [promoCode]);
  const rows = getProcedureRows(resultSets);
  return rows[0] || null;
}

export async function calculateDiscount(promoCode, items = []) {
  const itemsJson = JSON.stringify(
    (items || []).map((item) => ({
      menuItemId: item.menuItemId ?? item.id ?? null,
      itemName: item.itemName ?? item.name ?? null,
      unitPrice: Number(item.unitPrice ?? item.price ?? 0),
      quantity: Number(item.quantity ?? 0),
    }))
  );

  const resultSets = await callProcedure('sp_calculate_discount', [promoCode, itemsJson]);
  const rows = getProcedureRows(resultSets);
  const r = rows[0] || { discount_amount: 0, message: '' };
  return {
    discountAmount: Number(r.discount_amount || 0),
    message: r.message || '',
    promotionId: r.promotion_id || null,
  };
}

export async function getCities() {
  const resultSets = await callProcedure('sp_get_cities');
  return getProcedureRows(resultSets);
}

export async function getDistricts({ citySlug } = {}) {
  const resultSets = await callProcedure('sp_get_districts', [citySlug || null]);
  return getProcedureRows(resultSets);
}

export async function getStores({ citySlug, districtSlug } = {}) {
  const resultSets = await callProcedure('sp_get_stores', [citySlug || null, districtSlug || null]);
  return getProcedureRows(resultSets);
}

export async function getOpenJobs() {
  const resultSets = await callProcedure('sp_get_open_jobs');
  return getProcedureRows(resultSets);
}

export async function createContactMessage(payload) {
  const { name, email, phone = null, subject, message } = payload;
  const resultSets = await callProcedure('sp_create_contact_message', [name, email, phone, subject, message]);
  const rows = getLastProcedureRows(resultSets);
  return rows[0]?.insert_id || null;
}

export async function createUser(payload) {
  const { fullName, email, phone = null, password } = payload;
  const resultSets = await callProcedure('sp_create_user', [fullName, email, phone, password]);
  const rows = getLastProcedureRows(resultSets);
  return rows[0]?.insert_id || null;
}

export async function authenticateUser(email, password) {
  const resultSets = await callProcedure('sp_authenticate_user', [email, password]);
  const rows = getProcedureRows(resultSets);
  return rows[0] || null;
}

export async function getUserById(userId) {
  const resultSets = await callProcedure('sp_get_user_by_id', [userId]);
  const rows = getProcedureRows(resultSets);
  return rows[0] || null;
}

export async function getUserByEmail(email) {
  const resultSets = await callProcedure('sp_get_user_by_email', [email]);
  const rows = getProcedureRows(resultSets);
  return rows[0] || null;
}

export async function getStoreById(storeId) {
  const resultSets = await callProcedure('sp_get_store_by_id', [storeId]);
  const rows = getProcedureRows(resultSets);
  return rows[0] || null;
}

export async function createOrder(payload) {
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

  const discountAmount = Number(payload.discountAmount || 0);
  const itemsJson = JSON.stringify(
    items.map((item) => ({
      menuItemId: item.menuItemId ?? null,
      itemName: item.itemName,
      unitPrice: Number(item.unitPrice),
      quantity: Number(item.quantity),
    }))
  );

  const resultSets = await callProcedure('sp_create_order', [
    userId,
    storeId,
    customerName,
    customerEmail,
    customerPhone,
    promotionCode,
    notes,
    discountAmount,
    itemsJson,
  ]);

  const summaryRows = getLastProcedureRows(resultSets);
  const summaryRow = summaryRows[0] || null;

  if (!summaryRow) {
    throw new Error('Không thể tạo đơn hàng bằng stored procedure.');
  }

  return {
    orderId: Number(summaryRow.order_id),
    storeOrderNumber: Number(summaryRow.store_order_number),
  };
}

export async function hasPromotionUsage({ promotionId, userId = null, customerEmail = null }) {
  const resultSets = await callProcedure('sp_has_promotion_usage', [promotionId, userId, customerEmail]);
  const rows = getProcedureRows(resultSets);
  return Boolean(rows[0]?.used);
}

export async function recordPromotionUsage({ promotionId, userId = null, customerEmail = null, orderId = null }) {
  await callProcedure('sp_record_promotion_usage', [promotionId, userId, customerEmail, orderId]);
}

export async function getOrdersForStore(storeId) {
  const resultSets = await callProcedure('sp_get_orders_for_store', [storeId]);
  return normalizeOrderRows(getProcedureRows(resultSets));
}

export async function getOrdersForCustomer({ userId = null, customerEmail = '' } = {}) {
  const resultSets = await callProcedure('sp_get_orders_for_customer', [userId, customerEmail || null]);
  return normalizeOrderRows(getProcedureRows(resultSets));
}

export async function getOrderStatus(orderId) {
  const resultSets = await callProcedure('sp_get_order_status', [orderId]);
  const rows = getProcedureRows(resultSets);
  const r = rows[0];
  if (!r) return null;
  return {
    orderId: Number(r.order_id),
    status: r.order_status,
    storeId: r.store_id ? Number(r.store_id) : null,
    storeIsActive: Boolean(r.store_is_active),
    createdAt: r.created_at ? (r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at)) : null,
  };
}

export async function updateOrderStatus(orderId, status) {
  await callProcedure('sp_update_order_status', [orderId, status]);
}

export async function clearOrdersForStore(storeId) {
  const resultSets = await callProcedure('sp_clear_orders_for_store', [storeId]);
  const rows = getProcedureRows(resultSets);
  return Number(rows[0]?.affected_rows || 0);
}

export async function getStoreCleanupSettings(storeId) {
  const resultSets = await callProcedure('sp_get_store_cleanup_settings', [storeId]);
  const rows = getProcedureRows(resultSets);
  return rows[0] || { store_id: storeId, auto_clear_period: 'manual' };
}

export async function updateStoreCleanupSettings(storeId, autoClearPeriod) {
  await callProcedure('sp_update_store_cleanup_settings', [storeId, autoClearPeriod]);
}

export async function cleanupStoreOrdersBefore(storeId, beforeDate) {
  const resultSets = await callProcedure('sp_cleanup_store_orders_before', [storeId, beforeDate]);
  const rows = getProcedureRows(resultSets);
  return Number(rows[0]?.affected_rows || 0);
}
