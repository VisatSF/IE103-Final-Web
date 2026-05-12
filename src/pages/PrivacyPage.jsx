import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function PrivacyPage() {
  const items = [
    'Thông tin cá nhân được thu thập từ các form như đăng ký, liên hệ và ứng tuyển.',
    'Dữ liệu được sử dụng để hỗ trợ vận hành dịch vụ, chăm sóc khách hàng và cải thiện trải nghiệm sử dụng.',
    'Jobillee không chia sẻ thông tin cá nhân trái phép và sẽ áp dụng biện pháp bảo mật phù hợp.',
    'Người dùng có thể yêu cầu cập nhật, chỉnh sửa hoặc xóa thông tin trong phạm vi pháp luật cho phép.',
    'Chính sách này có thể được cập nhật khi có thay đổi về quy trình vận hành hoặc quy định liên quan.'
  ];

  return (
    <>
      <Helmet>
        <title>Chính sách bảo mật - Jobillee Vietnam</title>
        <meta
          name="description"
          content="Thông tin về cách Jobillee Vietnam thu thập, lưu trữ và sử dụng dữ liệu người dùng."
        />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[260px] bg-gradient-to-r from-[rgb(var(--jobillee-orange))] to-[rgb(var(--jobillee-yellow))]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-[rgb(var(--jobillee-dark))]">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                CHÍNH SÁCH BẢO MẬT
              </h1>
              <p className="text-xl md:text-2xl">Cam kết bảo vệ thông tin của khách hàng</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-5 text-gray-700 leading-relaxed bg-[rgb(var(--jobillee-cream))] rounded-2xl p-8 md:p-10">
              {items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default PrivacyPage;
