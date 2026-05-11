import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function TermsPage() {
  const terms = [
    'Thong tin tren website duoc cung cap de tham khao va co the duoc dieu chinh theo thoi diem.',
    'Tai khoan nguoi dung can cung cap thong tin chinh xac khi dang ky va tu chiu trach nhiem bao mat mat khau.',
    'Khuyen mai, gia ban va dieu kien ap dung co the thay doi theo cua hang, khu vuc hoac thoi gian.',
    'Nguoi dung khong duoc su dung website cho muc dich gian lan, gay roi he thong hoac xam pham quyen loi cua ben thu ba.',
    'Jobillee co quyen cap nhat noi dung, tam dung tinh nang hoac thay doi dich vu khi can thiet.'
  ];

  return (
    <>
      <Helmet>
        <title>Dieu khoan su dung - Jobillee Vietnam</title>
        <meta
          name="description"
          content="Dieu khoan su dung website Jobillee Vietnam."
        />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[260px] bg-gradient-to-r from-[rgb(var(--jobillee-red))] to-[rgb(var(--jobillee-red))]/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                DIEU KHOAN SU DUNG
              </h1>
              <p className="text-xl md:text-2xl">Quy dinh co ban khi su dung website Jobillee</p>
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
