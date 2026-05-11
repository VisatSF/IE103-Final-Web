import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function PrivacyPage() {
  const items = [
    'Thong tin ca nhan duoc thu thap tu cac form nhu dang ky, lien he va ung tuyen.',
    'Du lieu duoc su dung de ho tro van hanh dich vu, cham soc khach hang va cai thien trai nghiem su dung.',
    'Jobillee khong chia se thong tin ca nhan trai phep va se ap dung bien phap bao mat phu hop.',
    'Nguoi dung co the yeu cau cap nhat, chinh sua hoac xoa thong tin trong pham vi phap luat cho phep.',
    'Chinh sach nay co the duoc cap nhat khi co thay doi ve quy trinh van hanh hoac quy dinh lien quan.'
  ];

  return (
    <>
      <Helmet>
        <title>Chinh sach bao mat - Jobillee Vietnam</title>
        <meta
          name="description"
          content="Thong tin ve cach Jobillee Vietnam thu thap, luu tru va su dung du lieu nguoi dung."
        />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[260px] bg-gradient-to-r from-[rgb(var(--jobillee-orange))] to-[rgb(var(--jobillee-yellow))]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-[rgb(var(--jobillee-dark))]">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                CHINH SACH BAO MAT
              </h1>
              <p className="text-xl md:text-2xl">Cam ket bao ve thong tin cua khach hang</p>
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
