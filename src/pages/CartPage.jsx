import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import { formatPrice } from '@/lib/utils.js';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleCheckout = () => {
    navigate('/order', { state: { cart, totalPrice } });
  };

  const handleMinusClick = (item) => {
    if (item.quantity <= 1) {
      setItemToDelete(item);
    } else {
      updateQuantity(item.id, -1);
    }
  };

  const handleTrashClick = (item) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const formattedTotal = formatPrice(totalPrice) + ' đ';

  return (
    <>
      <Helmet>
        <title>Giỏ hàng - Jobillee Vietnam</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[rgb(var(--jobillee-cream))] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[rgb(var(--jobillee-dark))]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Giỏ hàng của bạn
            </h1>
            <Link to="/menu" className="flex items-center text-[rgb(var(--jobillee-red))] font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Tiếp tục mua hàng
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-500 mb-8">Bạn chưa thêm món ăn nào vào giỏ hàng.</p>
              <Button 
                onClick={() => navigate('/menu')}
                size="lg"
                className="bg-[rgb(var(--jobillee-red))] text-white hover:bg-[rgb(var(--jobillee-red))]/90 rounded-full px-8"
              >
                Khám phá thực đơn
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                      <p className="text-[rgb(var(--jobillee-red))] font-semibold mt-1">{item.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                      <div className="flex items-center border rounded-full overflow-hidden border-gray-200">
                        <button 
                          onClick={() => handleMinusClick(item)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="font-bold min-w-[80px] text-right">
                        {formatPrice(item.parsedPrice * item.quantity)} đ
                      </div>

                      <button 
                        onClick={() => handleTrashClick(item)}
                        className="text-gray-400 hover:text-[rgb(var(--jobillee-red))] transition-colors p-2"
                        aria-label="Xóa món ăn"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold border-b pb-4 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Tổng đơn hàng</h2>
                  
                  <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="font-medium text-gray-900">{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí giao hàng</span>
                      <span className="text-gray-500 italic">Tính khi thanh toán</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="font-bold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-[rgb(var(--jobillee-red))]">{formattedTotal}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-6 text-lg font-bold bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white rounded-xl shadow-md transition-all active:scale-[0.98]"
                    onClick={handleCheckout}
                  >
                    Thanh toán
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xoá món</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Bạn có chắc chắn muốn xoá <span className="font-bold text-[rgb(var(--jobillee-dark))]">{itemToDelete?.name}</span> khỏi giỏ hàng?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setItemToDelete(null)}
              className="font-medium"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-medium"
            >
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}