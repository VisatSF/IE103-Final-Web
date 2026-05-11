import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import NewsCard from '@/components/NewsCard.jsx';

function NewsPage() {
  const navigate = useNavigate();

  const newsArticles = [
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/JED_Man.jpg',
      title: 'Jobillee ra mắt chiến dịch lan tỏa niềm vui',
      description: 'Cùng chung tay mang đến những nụ cười rạng rỡ, Jobillee chính thức khởi động chiến dịch cộng đồng trên toàn quốc với hàng ngàn phần quà ý nghĩa.',
      date: '10/05/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/VN1.jpg',
      title: 'Khai trương cửa hàng thứ 150 tại Việt Nam',
      description: 'Đánh dấu cột mốc quan trọng, Jobillee hân hoan chào đón thành viên mới tại trung tâm TP.HCM với diện mạo hiện đại và không gian rộng rãi.',
      date: '28/04/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/THUMBNAIL-04-06.jpg',
      title: 'Khuyến mãi cực hot - Mùa hè sôi động',
      description: 'Giải nhiệt mùa hè cùng hàng loạt ưu đãi giảm giá lên đến 30% cho các combo gia đình và nước uống mát lạnh tại tất cả chi nhánh.',
      date: '15/04/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/thumbnail2.jpg',
      title: 'Giới thiệu thực đơn mới - Hương vị bùng nổ',
      description: 'Trải nghiệm ngay bộ sưu tập món mới với gà sốt cay đặc biệt và mỳ Ý phô mai, hứa hẹn sẽ làm bùng nổ vị giác của bạn.',
      date: '02/04/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/nh_m_y.jpg',
      title: 'Nhà máy chế biến mới đạt chuẩn quốc tế',
      description: 'Để đảm bảo chất lượng tươi ngon nhất, Jobillee vừa khánh thành nhà máy chế biến quy mô lớn, tuân thủ nghiêm ngặt các tiêu chuẩn an toàn thực phẩm.',
      date: '20/03/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/thumbnail_2.PNG',
      title: 'Sự kiện tri ân khách hàng thân thiết',
      description: 'Thay lời cảm ơn chân thành, Jobillee tổ chức chuỗi sự kiện tri ân với nhiều phần quà giá trị và thẻ thành viên VIP cho khách hàng.',
      date: '05/03/2026'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tin tức & Blog - Jobillee Vietnam</title>
        <meta name="description" content="Cập nhật những tin tức, khuyến mãi và sự kiện mới nhất từ chuỗi nhà hàng Jobillee Vietnam." />
      </Helmet>

      <Header />

      <main className="bg-muted/20 min-h-screen">
        {/* Hero Section */}
        <section className="bg-primary py-20 text-primary-foreground text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              TIN TỨC MỚI NHẤT
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Theo dõi những sự kiện, khuyến mãi và câu chuyện truyền cảm hứng từ đại gia đình Jobillee.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {newsArticles.map((article, index) => (
              <NewsCard
                key={index}
                image={article.image}
                title={article.title}
                description={article.description}
                date={article.date}
                onClick={() => navigate('/news')} 
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300">
              XEM THÊM BÀI VIẾT
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default NewsPage;