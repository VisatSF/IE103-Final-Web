import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function CookiesPage() {
  const sections = [
    'Cookie giup website ghi nho tuy chon co ban nhu ngon ngu, phien lam viec va mot so hanh vi su dung.',
    'Mot so cookie phuc vu phan tich hieu suat de doi ngu cai thien toc do va trai nghiem nguoi dung.',
    'Ban co the tu quan ly hoac xoa cookie trong trinh duyet, nhung mot so tinh nang co the bi anh huong.',
    'Tiep tuc su dung website co the duoc hieu la ban dong y voi cach su dung cookie theo chinh sach nay.'
  ];

  return (
    <>
      <Helmet>
        <title>Chinh sach Cookie - Jobillee Vietnam</title>
        <meta
          name="description"
          content="Thong tin ve viec su dung cookie tren website Jobillee Vietnam."
        />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[260px] bg-gradient-to-r from-[rgb(var(--jobillee-yellow))] to-[rgb(var(--jobillee-orange))]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-[rgb(var(--jobillee-dark))]">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                CHINH SACH COOKIE
              </h1>
              <p className="text-xl md:text-2xl">Thong tin ve du lieu trinh duyet duoc luu tren website</p>
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
