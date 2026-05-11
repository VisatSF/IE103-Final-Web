import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { ClipboardList, Clock3, CircleDollarSign, ChefHat, CheckCircle2, MapPin, Phone, Trash2, Settings2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
  clearStoreOrdersApi,
  getStoreDashboardApi,
  runStoreCleanupApi,
  updateStoreCleanupSettingsApi,
  updateStoreOrderStatusApi,
} from '@/lib/api.js';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { formatPrice } from '@/lib/utils.js';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'preparing', label: 'Đang chuẩn bị' },
  { value: 'ready', label: 'Sẵn sàng giao / nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const AUTO_CLEAR_OPTIONS = [
  { value: 'manual', label: 'Không tự xóa' },
  { value: 'day', label: 'Theo ngày' },
  { value: 'week', label: 'Theo tuần' },
  { value: 'month', label: 'Theo tháng' },
  { value: 'year', label: 'Theo năm' },
];

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

function StoreDashboardPage() {
  const { user, isLoading } = useAuth();
  const currentStoreId = user?.storeId ?? null;
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingCount: 0,
    activeCount: 0,
    completedCount: 0,
    revenue: 0,
  });
  const [cleanupSettings, setCleanupSettings] = useState({
    autoClearPeriod: 'manual',
  });
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const loadDashboard = useCallback(async ({ notify = false } = {}) => {
    if (!currentStoreId) {
      return;
    }

    try {
      setIsDashboardLoading(true);
      const cleanupResult = await runStoreCleanupApi(currentStoreId);
      const dashboard = await getStoreDashboardApi(currentStoreId);

      setStore(dashboard.store);
      setOrders(dashboard.orders);
      setStats(dashboard.stats);
      setCleanupSettings(dashboard.settings);

      if (notify) {
        toast.success(
          cleanupResult.removedCount > 0
            ? `Đã làm mới và dọn ${cleanupResult.removedCount} đơn cũ.`
            : 'Đã làm mới danh sách đơn hàng.'
        );
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDashboardLoading(false);
    }
  }, [currentStoreId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Show loading while auth is being restored
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-400px)] bg-[rgb(var(--jobillee-cream))] py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--jobillee-red))]"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user || user.role !== 'store_manager') {
    return <Navigate to="/login" replace />;
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateStoreOrderStatusApi(orderId, status);
      await loadDashboard();
      toast.success('Đã cập nhật trạng thái đơn hàng.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearOrders = async () => {
    if (!currentStoreId) {
      return;
    }

    const shouldClear = window.confirm('Bạn có chắc muốn xóa toàn bộ danh sách đơn của cửa hàng này không?');
    if (!shouldClear) {
      return;
    }

    try {
      const result = await clearStoreOrdersApi(currentStoreId);
      await loadDashboard();
      toast.success(
        result.removedCount > 0
          ? `Đã xóa ${result.removedCount} đơn khỏi danh sách cửa hàng.`
          : 'Danh sách hiện không có đơn để xóa.'
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAutoClearChange = async (event) => {
    try {
      const result = await updateStoreCleanupSettingsApi(currentStoreId, event.target.value);
      setCleanupSettings({ autoClearPeriod: result.autoClearPeriod });
      await loadDashboard();
      toast.success('Đã lưu cài đặt tự động xóa danh sách.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Store Dashboard - {store?.name || 'Jobillee'}</title>
      </Helmet>

      <Header />

      <main className="bg-[rgb(var(--jobillee-cream))] min-h-screen">
        <section className="bg-[rgb(var(--jobillee-red))] text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.2em] opacity-80">Store Dashboard</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {store?.name || 'Đang tải...'}
            </h1>
            <div className="mt-5 flex flex-col gap-2 text-sm md:text-base opacity-90">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {store?.address || 'Đang tải địa chỉ cửa hàng'}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {store?.phone || 'Đang tải số điện thoại'}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <ClipboardList className="h-8 w-8 text-[rgb(var(--jobillee-red))]" />
                <p className="mt-4 text-sm text-gray-500">Tổng đơn</p>
                <p className="mt-2 text-3xl font-bold text-[rgb(var(--jobillee-dark))]">{stats.totalOrders}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <Clock3 className="h-8 w-8 text-[rgb(var(--jobillee-orange))]" />
                <p className="mt-4 text-sm text-gray-500">Chờ xác nhận</p>
                <p className="mt-2 text-3xl font-bold text-[rgb(var(--jobillee-dark))]">{stats.pendingCount}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <ChefHat className="h-8 w-8 text-[rgb(var(--jobillee-yellow))]" />
                <p className="mt-4 text-sm text-gray-500">Đang xử lý</p>
                <p className="mt-2 text-3xl font-bold text-[rgb(var(--jobillee-dark))]">{stats.activeCount}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <CircleDollarSign className="h-8 w-8 text-[rgb(var(--jobillee-red))]" />
                <p className="mt-4 text-sm text-gray-500">Doanh thu</p>
                <p className="mt-2 text-3xl font-bold text-[rgb(var(--jobillee-dark))]">{formatPrice(stats.revenue)}đ</p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-white shadow-lg overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-2xl font-bold text-[rgb(var(--jobillee-red))]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Đơn hàng về cửa hàng
                </h2>
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_auto] gap-4">
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-[rgb(var(--jobillee-dark))]">
                      <Settings2 className="h-4 w-4 text-[rgb(var(--jobillee-red))]" />
                      <p className="font-semibold">Cài đặt tự động xóa danh sách</p>
                    </div>
                    <select
                      value={cleanupSettings.autoClearPeriod}
                      onChange={handleAutoClearChange}
                      className="mt-3 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    >
                      {AUTO_CLEAR_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <p className="font-semibold">Xóa danh sách đơn của cửa hàng</p>
                    </div>
                    <Button type="button" variant="outline" onClick={handleClearOrders} className="mt-4 border-red-300 bg-white text-red-700 hover:bg-red-100">
                      Xóa danh sách
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {isDashboardLoading ? (
                  <div className="rounded-2xl bg-[rgb(var(--jobillee-cream))] p-8 text-center text-gray-600">
                    Đang tải danh sách đơn hàng...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl bg-[rgb(var(--jobillee-cream))] p-8 text-center text-gray-600">
                    Hiện chưa có đơn hàng nào gửi về cửa hàng này.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-gray-200 p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-xl font-bold text-[rgb(var(--jobillee-dark))]">
                              Đơn #{order.id}
                            </p>
                            <span className="rounded-full bg-[rgb(var(--jobillee-cream))] px-3 py-1 text-sm font-medium text-[rgb(var(--jobillee-red))]">
                              {ORDER_STATUSES.find((item) => item.value === order.status)?.label || order.status}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-700 font-medium">{order.customerName}</p>
                          <p className="mt-1 text-sm text-gray-500">{order.customerEmail} | {order.customerPhone}</p>
                          <p className="mt-1 text-sm text-gray-500">Tạo lúc: {formatDateTime(order.createdAt)}</p>
                          {order.promotionCode ? (
                            <p className="mt-2 inline-flex rounded-full bg-[rgb(var(--jobillee-yellow))]/20 px-3 py-1 text-sm font-semibold text-[rgb(var(--jobillee-dark))]">
                              Voucher: {order.promotionCode}
                            </p>
                          ) : null}
                          {order.notes ? (
                            <p className="mt-3 rounded-xl bg-[rgb(var(--jobillee-cream))] px-4 py-3 text-sm text-gray-700">
                              Ghi chú: {order.notes}
                            </p>
                          ) : null}
                        </div>

                        <div className="min-w-[240px]">
                          <label className="block text-sm font-semibold text-[rgb(var(--jobillee-dark))]">
                            Cập nhật trạng thái
                          </label>
                          <select
                            value={order.status}
                            onChange={(event) => handleStatusChange(order.id, event.target.value)}
                            className="mt-2 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          {order.status === 'completed' ? (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Đơn này đã hoàn thành
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-5">
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="font-semibold text-[rgb(var(--jobillee-dark))]">Các món trong đơn</p>
                          <div className="mt-3 space-y-3">
                            {order.items.map((item, index) => (
                              <div key={`${order.id}-${index}`} className="flex items-start justify-between gap-4 border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                <div className="flex-1">
                                  <p className="font-medium text-[rgb(var(--jobillee-dark))]">{item.itemName}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity} x {formatPrice(item.unitPrice)}đ
                                  </p>
                                </div>
                                <p className="font-semibold text-[rgb(var(--jobillee-red))]">
                                  {formatPrice(item.lineTotal)}đ
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-[rgb(var(--jobillee-cream))] p-4">
                          <p className="font-semibold text-[rgb(var(--jobillee-dark))]">Tổng kết đơn</p>
                          <div className="mt-3 space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                              <span>Tạm tính</span>
                              <span>{formatPrice(order.subtotalAmount)}đ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Giá đã giảm</span>
                              <span>- {formatPrice(order.discountAmount)}đ</span>
                            </div>
                            <div className="flex justify-between font-semibold text-[rgb(var(--jobillee-red))] pt-2 border-t border-white/70">
                              <span>Thành tiền</span>
                              <span>{formatPrice(order.totalAmount)}đ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="button" variant="outline" onClick={() => loadDashboard({ notify: true })} className="border-[rgb(var(--jobillee-red))] text-[rgb(var(--jobillee-red))]">
                Làm mới danh sách
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default StoreDashboardPage;
