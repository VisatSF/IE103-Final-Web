import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Gift, Percent, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getPromotionsApi } from '@/lib/api.js';

function formatDateLabel(value) {
  if (!value) {
    return 'Đang cập nhật';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const iconMap = { Percent, Gift, Star, Calendar };

  useEffect(() => {
    let isMounted = true;

    async function loadPromotions() {
      try {
        setIsLoading(true);
        const response = await getPromotionsApi();
        if (isMounted) {
          setPromotions(response.promotions || []);
        }
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

    loadPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Khuyến mãi - Jobillee Vietnam</title>
        <meta name="description" content="Danh sách khuyến mãi đang được tải trực tiếp từ hệ thống dữ liệu Jobillee." />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[300px] bg-gradient-to-r from-[rgb(var(--jobillee-yellow))] to-[rgb(var(--jobillee-orange))]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-[rgb(var(--jobillee-dark))]">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                KHUYẾN MÃI
              </h1>
              <p className="text-xl md:text-2xl">Ưu đãi hấp dẫn mỗi ngày</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="rounded-2xl bg-[rgb(var(--jobillee-cream))] p-8 text-center text-gray-600 shadow-md">
                Đang tải danh sách khuyến mãi từ MySQL...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promotions.map((promo) => {
                  const Icon = iconMap[promo.iconKey] || Gift;

                  return (
                    <div key={promo.code} className="bg-gradient-to-br from-[rgb(var(--jobillee-cream))] to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-[rgb(var(--jobillee-red))] rounded-full flex items-center justify-center">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-2xl font-bold text-[rgb(var(--jobillee-dark))] mb-2">
                            {promo.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {promo.description}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2 gap-4">
                          <span className="text-sm text-gray-600">Mã khuyến mãi:</span>
                          <span className="text-lg font-bold text-[rgb(var(--jobillee-red))]">
                            {promo.code}
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-sm text-gray-600">Có hiệu lực đến:</span>
                          <span className="text-sm font-semibold text-[rgb(var(--jobillee-dark))]">
                            {formatDateLabel(promo.validUntil)}
                          </span>
                        </div>
                      </div>
                      <Button asChild className="w-full bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold transition-all duration-200 active:scale-98">
                        <a href="/menu">Sử dụng ngay</a>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-[rgb(var(--jobillee-cream))]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[rgb(var(--jobillee-red))] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Điều khoản & Điều kiện
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--jobillee-red))] mt-1">•</span>
                <span>Mỗi mã khuyến mãi chỉ được sử dụng một lần cho mỗi đơn hàng.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--jobillee-red))] mt-1">•</span>
                <span>Không áp dụng đồng thời nhiều chương trình khuyến mãi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--jobillee-red))] mt-1">•</span>
                <span>Khuyến mãi có thể thay đổi theo dữ liệu đang hoạt động trong hệ thống.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default PromotionsPage;
