import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Frown, ArrowLeft, Home } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Trang không tìm thấy - Jobillee Vietnam</title>
        <meta name="description" content="Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển." />
      </Helmet>

      <Header />

      <main className="min-h-[70vh] bg-[rgb(var(--jobillee-cream))] flex items-center justify-center py-20 px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center">
          <div className="flex justify-center mb-8">
            <div className="h-32 w-32 bg-[rgb(var(--jobillee-yellow))]/20 rounded-full flex items-center justify-center">
              <Frown className="h-16 w-16 text-[rgb(var(--jobillee-red))]" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--jobillee-dark))] mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[rgb(var(--jobillee-red))] mb-6">
            Trang không tìm thấy
          </h2>
          
          <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
            Rất tiếc, nội dung bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không thể truy cập.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="gap-2 border-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/')}
              className="gap-2 bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default NotFoundPage;