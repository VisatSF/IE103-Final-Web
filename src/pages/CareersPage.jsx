import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';

function CareersPage() {
  const jobs = [
    {
      title: 'Nhân viên phục vụ',
      location: 'TP.HCM - Nhiều vị trí',
      type: 'Toàn thời gian',
      salary: '7-9 triệu/tháng',
      description: 'Phục vụ khách hàng, đảm bảo chất lượng dịch vụ tốt nhất'
    },
    {
      title: 'Đầu bếp',
      location: 'Hà Nội',
      type: 'Toàn thời gian',
      salary: '12-18 triệu/tháng',
      description: 'Chế biến món ăn theo tiêu chuẩn, đảm bảo vệ sinh an toàn thực phẩm'
    },
    {
      title: 'Quản lý cửa hàng',
      location: 'Đà Nẵng',
      type: 'Toàn thời gian',
      salary: '15-22 triệu/tháng',
      description: 'Quản lý vận hành cửa hàng, đào tạo và phát triển đội ngũ'
    },
    {
      title: 'Nhân viên giao hàng',
      location: 'TP.HCM',
      type: 'Bán thời gian',
      salary: '6-8 triệu/tháng',
      description: 'Giao hàng nhanh chóng, đảm bảo chất lượng món ăn'
    },
    {
      title: 'Marketing Executive',
      location: 'TP.HCM',
      type: 'Toàn thời gian',
      salary: '10-15 triệu/tháng',
      description: 'Lập kế hoạch và triển khai các chiến dịch marketing'
    },
    {
      title: 'Nhân viên kho',
      location: 'Cần Thơ',
      type: 'Toàn thời gian',
      salary: '7-10 triệu/tháng',
      description: 'Quản lý kho, kiểm soát hàng hóa và nguyên vật liệu'
    }
  ];

  const benefits = [
    'Lương cạnh tranh, thưởng theo hiệu quả công việc',
    'Bảo hiểm xã hội, y tế đầy đủ',
    'Môi trường làm việc năng động, thân thiện',
    'Cơ hội thăng tiến rõ ràng',
    'Đào tạo và phát triển kỹ năng',
    'Nghỉ phép, nghỉ lễ theo quy định'
  ];

  return (
    <>
      <Helmet>
        <title>Tuyển dụng - Jobillee Vietnam</title>
        <meta name="description" content="Cơ hội nghề nghiệp tại Jobillee Vietnam. Tìm kiếm vị trí phù hợp và gia nhập đội ngũ của chúng tôi." />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] bg-gradient-to-r from-[rgb(var(--jobillee-red))] to-[rgb(var(--jobillee-red))]/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                TUYỂN DỤNG
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl leading-relaxed">
                Gia nhập đội ngũ Jobillee - Nơi bạn phát triển sự nghiệp
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-12 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Quyền lợi của bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-[rgb(var(--jobillee-cream))] rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[rgb(var(--jobillee-red))] rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="py-20 bg-[rgb(var(--jobillee-cream))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-12 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Vị trí đang tuyển
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-2xl font-bold text-[rgb(var(--jobillee-dark))] mb-4">
                    {job.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-[rgb(var(--jobillee-red))]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-[rgb(var(--jobillee-red))]" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4 text-[rgb(var(--jobillee-red))]" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {job.description}
                  </p>
                  <Button 
                    className="w-full bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-semibold transition-all duration-200 active:scale-98"
                  >
                    Ứng tuyển ngay
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="h-16 w-16 text-[rgb(var(--jobillee-red))] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-[rgb(var(--jobillee-red))] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Không tìm thấy vị trí phù hợp?
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Gửi CV của bạn cho chúng tôi. Khi có vị trí phù hợp, chúng tôi sẽ liên hệ ngay.
            </p>
            <Button 
              size="lg"
              className="bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold px-8 transition-all duration-200 active:scale-95"
            >
              Gửi CV tự do
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CareersPage;