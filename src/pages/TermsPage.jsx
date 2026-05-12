import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function TermsPage() {
  const terms = [
    'Thông tin trên website được cung cấp để tham khảo và có thể được điều chỉnh theo thời điểm.',
    'Tài khoản người dùng cần cung cấp thông tin chính xác khi đăng ký và tự chịu trách nhiệm bảo mật mật khẩu.',
    'Khuyến mãi, giá bán và điều kiện áp dụng có thể thay đổi theo cửa hàng, khu vực hoặc thời gian.',
    'Người dùng không được sử dụng website cho mục đích gian lận, gây rối hệ thống hoặc xâm phạm quyền lợi của bên thứ ba.',
    'Jobillee có quyền cập nhật nội dung, tạm dừng tính năng hoặc thay đổi dịch vụ khi cần thiết.'
  ];

  return (
    <>
        <Helmet>
          <title>Điều khoản sử dụng - Jobillee Vietnam</title>
          <meta
            name="description"
            content="Điều khoản sử dụng website Jobillee Vietnam."
          />
        </Helmet>

      <Header />

      <main>
        <section className="relative h-[260px] bg-gradient-to-r from-[rgb(var(--jobillee-red))] to-[rgb(var(--jobillee-red))]/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                ĐIỀU KHOẢN SỬ DỤNG
              </h1>
              <p className="text-xl md:text-2xl">Quy định cơ bản khi sử dụng website Jobillee</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[rgb(var(--jobillee-cream))] rounded-2xl p-8 md:p-10">
              <div className="space-y-5 text-gray-700 leading-relaxed">
                {terms.map((term) => (
                  <p key={term}>{term}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default TermsPage;
