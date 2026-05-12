import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function CookiesPage() {
  const sections = [
    'Cookie giúp website ghi nhớ tuỳ chọn cơ bản như ngôn ngữ, phiên làm việc và một số hành vi sử dụng.',
    'Một số cookie phục vụ phân tích hiệu suất để đội ngũ cải thiện tốc độ và trải nghiệm người dùng.',
    'Bạn có thể tự quản lý hoặc xóa cookie trong trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.',
    'Tiếp tục sử dụng website có thể được hiểu là bạn đồng ý với cách sử dụng cookie theo chính sách này.'
  ];

  return (
    <>
        <Helmet>
          <title>Chính sách Cookie - Jobillee Vietnam</title>
          <meta
            name="description"
            content="Thông tin về việc sử dụng cookie trên website Jobillee Vietnam."
          />
        </Helmet>

      <Header />

      <main>
        <section className="relative h-[260px] bg-gradient-to-r from-[rgb(var(--jobillee-yellow))] to-[rgb(var(--jobillee-orange))]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-[rgb(var(--jobillee-dark))]">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                CHÍNH SÁCH COOKIE
              </h1>
              <p className="text-xl md:text-2xl">Thông tin về dữ liệu trình duyệt được lưu trên website</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[rgb(var(--jobillee-cream))] rounded-2xl p-8 md:p-10 space-y-5 text-gray-700 leading-relaxed">
              {sections.map((section) => (
                <p key={section}>{section}</p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CookiesPage;
