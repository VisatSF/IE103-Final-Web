import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Store, PartyPopper, Users, ShoppingBag, Truck, Clock } from 'lucide-react';

function ServicesPage() {
  const services = [
    {
      icon: Store,
      title: 'LẤY TẠI CỬA HÀNG',
      description: 'Đặt hàng trước qua app hoặc website, đến cửa hàng lấy ngay không cần chờ đợi. Tiết kiệm thời gian và nhận ưu đãi đặc biệt.'
    },
    {
      icon: Truck,
      title: 'GIAO HÀNG TẬN NƠI',
      description: 'Dịch vụ giao hàng nhanh chóng trong vòng 30 phút. Đảm bảo món ăn còn nóng hổi khi đến tay bạn.'
    },
    {
      icon: PartyPopper,
      title: 'ĐẶT TIỆC SINH NHẬT',
      description: 'Tổ chức tiệc sinh nhật cho bé với không gian vui nhộn, thực đơn đa dạng và nhiều hoạt động thú vị.'
    },
    {
      icon: Users,
      title: 'JOBILLEE KIDS CLUB',
      description: 'Câu lạc bộ dành riêng cho trẻ em với các hoạt động giải trí, học tập và quà tặng hấp dẫn mỗi tháng.'
    },
    {
      icon: ShoppingBag,
      title: 'ĐƠN HÀNG LỚN',
      description: 'Phục vụ đơn hàng lớn cho sự kiện, tiệc công ty, họp mặt gia đình với giá ưu đãi và dịch vụ chuyên nghiệp.'
    },
    {
      icon: Clock,
      title: 'ĐẶT HÀNG TRƯỚC',
      description: 'Đặt hàng trước để đảm bảo có món ăn yêu thích vào giờ cao điểm. Nhận ưu đãi khi đặt trước 24 giờ.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dịch vụ - Jobillee Vietnam</title>
        <meta name="description" content="Khám phá các dịch vụ tiện ích của Jobillee: giao hàng tận nơi, đặt tiệc sinh nhật, Kids Club và nhiều dịch vụ khác." />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[300px] bg-gradient-to-r from-[rgb(var(--jobillee-red))] to-[rgb(var(--jobillee-red))]/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                DỊCH VỤ
              </h1>
              <p className="text-xl md:text-2xl">
                Tận hưởng những khoảnh khắc trọn vẹn
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-[rgb(var(--jobillee-cream))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                CÁC DỊCH VỤ CỦA CHÚNG TÔI
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Jobillee cam kết mang đến trải nghiệm tuyệt vời với đa dạng dịch vụ tiện ích
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Bạn cần hỗ trợ?
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Liên hệ với chúng tôi để được tư vấn chi tiết về các dịch vụ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:19001533"
                className="inline-flex items-center justify-center bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 active:scale-95"
              >
                Gọi ngay: 1900-1533
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-[rgb(var(--jobillee-dark))] font-bold px-8 py-4 rounded-lg border-2 border-[rgb(var(--jobillee-red))] transition-all duration-200 active:scale-95"
              >
                Gửi yêu cầu
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ServicesPage;