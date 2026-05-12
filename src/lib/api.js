const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ie103-final-web.onrender.com';

function buildApiUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.message
      ? payload.message
      : 'Yeu cau that bai.';
    throw new Error(message);
  }

  return payload;
}

function dedupeStores(stores = []) {
  const seen = new Set();

  return stores.filter((store) => {
    const key = [
      store.id,
      store.name,
      store.address,
      store.phone,
      store.cityName,
      store.districtName,
    ]
      .map((value) => String(value ?? '').trim().toLowerCase())
      .join('|');

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function loginApi(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerApi(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMenuApi() {
  return apiRequest('/api/menu');
}

export function getPromotionsApi({ userId = null, email = '' } = {}) {
  const params = new URLSearchParams();
  if (userId) params.set('userId', String(userId));
  if (email) params.set('email', email);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/promotions${query}`);
}

export function getStoresMetaApi(city = '') {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  return apiRequest(`/api/stores/meta${query}`);
}

export function getStoresApi({ city = '', district = '' } = {}) {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (district) params.set('district', district);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/stores${query}`).then((payload) => ({
    ...payload,
    stores: dedupeStores(payload.stores || []),
  }));
}

export function createOrderApi(payload) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOrderStatusApi(orderId) {
  return apiRequest(`/api/orders/${encodeURIComponent(orderId)}/status`);
}

export function getUserOrdersApi({ userId = null, email = '' } = {}) {
  const params = new URLSearchParams();
  if (userId) params.set('userId', String(userId));
  if (email) params.set('email', email);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/orders${query}`);
}

export function getStoreDashboardApi(storeId) {
  return apiRequest(`/api/store/dashboard/${storeId}`);
}

export function updateStoreOrderStatusApi(orderId, status) {
  return apiRequest(`/api/store/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function clearStoreOrdersApi(storeId) {
  return apiRequest(`/api/store/orders?storeId=${encodeURIComponent(storeId)}`, {
    method: 'DELETE',
  });
}

export function updateStoreCleanupSettingsApi(storeId, autoClearPeriod) {
  return apiRequest(`/api/store/settings/${storeId}`, {
    method: 'PATCH',
    body: JSON.stringify({ autoClearPeriod }),
  });
}

export function runStoreCleanupApi(storeId) {
  return apiRequest(`/api/store/cleanup/${storeId}`, {
    method: 'POST',
  });
}
