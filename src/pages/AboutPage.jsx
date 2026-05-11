import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Users, Store, Heart } from 'lucide-react';

function AboutPage() {
  const milestones = [
    { year: '2015', title: 'Thành lập', description: 'Cửa hàng đầu tiên tại TP.HCM' },
    { year: '2018', title: 'Mở rộng', description: 'Đạt 20 cửa hàng trên toàn quốc' },
    { year: '2022', title: 'Phát triển', description: 'Vượt mốc 50 cửa hàng' },
    { year: '2026', title: 'Hiện tại', description: 'Hơn 100 cửa hàng và tiếp tục phát triển' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Chất lượng',
      description: 'Cam kết sử dụng nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm'
    },
    {
      icon: Users,
      title: 'Khách hàng',
      description: 'Đặt sự hài lòng của khách hàng lên hàng đầu trong mọi hoạt động'
    },
    {
      icon: Store,
      title: 'Tiện lợi',
      description: 'Mạng lưới cửa hàng rộng khắp, giao hàng nhanh chóng'
    },
    {
      icon: Heart,
      title: 'Tận tâm',
      description: 'Phục vụ với tất cả sự nhiệt tình và chuyên nghiệp'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Về Jobillee - Câu chuyện thương hiệu</title>
        <meta name="description" content="Tìm hiểu về lịch sử phát triển, sứ mệnh và giá trị cốt lõi của Jobillee Vietnam - chuỗi nhà hàng gà rán hàng đầu Việt Nam." />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] bg-gradient-to-r from-[rgb(var(--jobillee-red))] to-[rgb(var(--jobillee-red))]/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                VỀ JOBILLEE
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl leading-relaxed">
                Hành trình mang đến niềm vui ẩm thực cho hàng triệu người Việt
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-8 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              CÂU CHUYỆN CỦA CHÚNG TÔI
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Jobillee Vietnam được thành lập vào năm 2015 với mục tiêu mang đến cho người Việt Nam 
                những món ăn nhanh chất lượng cao, ngon miệng và giá cả phải chăng. Bắt đầu từ một cửa hàng 
                nhỏ tại TP. Hồ Chí Minh, chúng tôi đã không ngừng phát triển và mở rộng.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Với công thức độc quyền cho gà rán giòn tan, kết hợp cùng các món ăn đa dạng từ mỳ Ý, 
                burger đến các món tráng miệng hấp dẫn, Jobillee đã trở thành lựa chọn hàng đầu của 
                hàng triệu gia đình Việt.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ngày nay, với hơn 100 cửa hàng trên toàn quốc, chúng tôi tự hào là một trong những 
                chuỗi nhà hàng thức ăn nhanh lớn nhất Việt Nam, luôn đặt chất lượng và sự hài lòng 
                của khách hàng lên hàng đầu.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-[rgb(var(--jobillee-cream))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-12 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              HÀNH TRÌNH PHÁT TRIỂN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl font-bold text-[rgb(var(--jobillee-yellow))] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-bold text-[rgb(var(--jobillee-dark))] mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-12 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              GIÁ TRỊ CỐT LÕI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgb(var(--jobillee-red))] rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[rgb(var(--jobillee-dark))] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutPage;