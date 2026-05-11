import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { formatPrice } from '@/lib/utils.js';
import { createOrderApi, getPromotionsApi, getStoresApi } from '@/lib/api.js';
import { useCart } from '@/contexts/CartContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

function calculateDiscount(promotion, subtotalAmount) {
  if (!promotion || subtotalAmount <= 0) {
    return 0;
  }

  if (promotion.discountType === 'percentage') {
    return Math.round((subtotalAmount * Number(promotion.discountValue)) / 100);
  }

  return Math.min(subtotalAmount, Number(promotion.discountValue));
}

export default function OrderPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [availablePromotions, setAvailablePromotions] = useState([]);
  const [promotionCodeInput, setPromotionCodeInput] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    storeId: '',
    notes: '',
  });

  useEffect(() => {
    if (!cart.length && !completedOrder) {
      navigate('/cart');
    }
  }, [cart.length, completedOrder, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const [{ stores: nextStores }, promotionsResponse] = await Promise.all([
          getStoresApi(),
          getPromotionsApi({
            userId: user?.id ?? null,
            email: user?.email || '',
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setStores(nextStores || []);
        setAvailablePromotions(promotionsResponse.promotions || []);
        setFormData((current) => ({
          ...current,
          customerName: current.customerName || user?.fullName || '',
          customerEmail: current.customerEmail || user?.email || '',
          customerPhone: current.customerPhone || user?.phone || '',
          storeId: current.storeId || String(nextStores?.[0]?.id || ''),
        }));
      } catch (error) {
        if (isMounted) {
          toast.error(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const discountAmount = useMemo(
    () => calculateDiscount(appliedPromotion, totalPrice),
    [appliedPromotion, totalPrice]
  );
  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleApplyPromotion = (code = promotionCodeInput) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error('Vui lòng nhập mã khuyến mãi.');
      return;
    }

    const matchedPromotion = availablePromotions.find((promotion) => promotion.code === normalizedCode);
    if (!matchedPromotion) {
      toast.error('Mã khuyến mãi không hợp lệ hoặc đã được sử dụng.');
      return;
    }

    setPromotionCodeInput(normalizedCode);
    setAppliedPromotion(matchedPromotion);
    toast.success(`Đã áp dụng mã ${matchedPromotion.code}.`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      toast.error('Giỏ hàng đang trống.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createOrderApi({
        userId: user?.id ?? null,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        storeId: Number(formData.storeId),
        notes: formData.notes,
        promotionCode: appliedPromotion?.code || '',
        items: cart.map((item) => ({
          menuItemId: item.menuItemId ?? item.id,
          itemName: item.name,
          unitPrice: item.parsedPrice,
          quantity: item.quantity,
        })),
      });

      setCompletedOrder({
        orderId: result.orderId,
        subtotalAmount: totalPrice,
        discountAmount: result.discountAmount,
        totalAmount: result.totalAmount,
        items: cart,
        createdAt: new Date().toLocaleString('vi-VN'),
      });
      clearCart();
      toast.success(`Đặt đơn thành công. Mã đơn #${result.orderId}.`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <>
        <Helmet>
          <title>Xác nhận đơn hàng - Jobillee Vietnam</title>
        </Helmet>

        <Header />

        <main className="min-h-screen bg-muted/20 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-2xl shadow-sm p-8 md:p-12 text-center mb-8 border border-border/50">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">Đặt hàng thành công!</h1>
              <p className="text-muted-foreground mb-6">Đơn hàng đã được ghi vào hệ thống MySQL.</p>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                <div>
                  <span className="block font-medium text-foreground">Mã đơn hàng</span>
                  #{completedOrder.orderId}
                </div>
                <div>
                  <span className="block font-medium text-foreground">Thời gian</span>
                  {completedOrder.createdAt}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm p-8 border border-border/50 mb-8">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Chi tiết đơn hàng</h2>

              <div className="space-y-4 mb-8">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">SL: {item.quantity} x {formatPrice(item.parsedPrice)}đ</p>
                    </div>
                    <div className="font-bold">
                      {formatPrice(item.parsedPrice * item.quantity)}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{formatPrice(completedOrder.subtotalAmount)}đ</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Giảm giá</span>
                  <span>{formatPrice(completedOrder.discountAmount || 0)}đ</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(completedOrder.totalAmount)}đ</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={() => navigate('/menu')} variant="outline" className="gap-2 font-bold rounded-full px-8">
                <ArrowLeft className="w-4 h-4" />
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Thanh toán - Jobillee Vietnam</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-muted/20 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] gap-8">
            <section className="bg-card rounded-2xl shadow-sm border border-border/50 p-8">
              <h1 className="text-3xl font-bold text-primary mb-6">Thông tin đặt hàng</h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Họ và tên *</Label>
                    <Input id="customerName" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Số điện thoại *</Label>
                    <Input id="customerPhone" value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input id="customerEmail" type="email" value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeId">Cửa hàng nhận đơn *</Label>
                  <select
                    id="storeId"
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} />
                </div>

                <div className="rounded-xl border border-dashed border-[rgb(var(--jobillee-red))]/40 bg-[rgb(var(--jobillee-cream))] p-4">
                  <Label htmlFor="promotionCode">Mã khuyến mãi</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      id="promotionCode"
                      value={promotionCodeInput}
                      onChange={(event) => setPromotionCodeInput(event.target.value.toUpperCase())}
                      placeholder="Nhập mã, ví dụ FAMILY30"
                    />
                    <Button type="button" onClick={() => handleApplyPromotion()}>
                      Áp dụng
                    </Button>
                  </div>

                  {appliedPromotion ? (
                    <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                      <p className="font-semibold text-[rgb(var(--jobillee-dark))]">
                        Đang áp dụng: {appliedPromotion.code}
                      </p>
                      <p className="mt-1 text-gray-600">{appliedPromotion.title}</p>
                      <button type="button" onClick={() => {
                        setAppliedPromotion(null);
                        setPromotionCodeInput('');
                      }} className="mt-2 text-[rgb(var(--jobillee-red))] underline">
                        Bỏ mã này
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-[rgb(var(--jobillee-dark))]">Mã hiện có cho bạn</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {availablePromotions.map((promotion) => (
                        <button
                          key={promotion.code}
                          type="button"
                          onClick={() => handleApplyPromotion(promotion.code)}
                          className="rounded-full border border-[rgb(var(--jobillee-red))]/30 bg-white px-3 py-1 text-sm font-medium text-[rgb(var(--jobillee-red))]"
                        >
                          {promotion.code}
                        </button>
                      ))}
                      {availablePromotions.length === 0 ? (
                        <p className="text-sm text-gray-500">Không có mã khuyến mãi khả dụng.</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting || isLoading || !cart.length} className="w-full bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold">
                  {isSubmitting ? 'Đang gửi đơn...' : 'Xác nhận đặt hàng'}
                </Button>
              </form>
            </section>

            <aside className="bg-card rounded-2xl shadow-sm border border-border/50 p-8 h-fit xl:sticky xl:top-28">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>

              {cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 py-3 border-b border-border/30">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.parsedPrice * item.quantity)}đ</p>
                </div>
              ))}

              <div className="pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}đ</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Giảm giá</span>
                  <span>{formatPrice(discountAmount)}đ</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}đ</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
