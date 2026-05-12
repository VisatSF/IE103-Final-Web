
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Store, PartyPopper, Users, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import NewsCard from '@/components/NewsCard.jsx';
import { Button } from '@/components/ui/button.jsx';

function HomePage() {
  const navigate = useNavigate();

  const menuProducts = [
    {
      image: '/combo-mot-minh-an-ngon.jpg',
      title: 'Combo Một Mình Ăn Ngon',
      description: '1 miếng gà giòn + 1 mì ý sốt bò bằm, gọn gàng và no đủ.',
      buttonText: 'ĐẶT NGAY'
    },
    {
      image: '/com-ga-sot-cay.jpg',
      title: 'Cơm gà sốt cay',
      description: '1 miếng gà sốt cay + cơm nóng, đậm vị và dễ ăn.',
      buttonText: 'ĐẶT NGAY'
    },
    {
      image: '/my-y-sot-bo-bam-vua.jpg',
      title: 'Mỳ Ý sốt bò bằm (Vừa)',
      description: 'Mỳ Ý sốt bò bằm cỡ vừa, hợp cho bữa trưa nhanh gọn.',
      buttonText: 'ĐẶT NGAY'
    },
    {
      image: '/banh-xoai-dao.webp',
      title: 'Bánh xoài đào',
      description: 'Tráng miệng ngọt mát, cân bằng vị cho bữa ăn.',
      buttonText: 'ĐẶT NGAY'
    }
  ];

  const services = [
    {
      icon: Store,
      title: 'LẤY TẠI CỬA HÀNG',
      description: 'Đặt hàng trước và lấy tại cửa hàng gần nhất, tiết kiệm thời gian chờ đợi.'
    },
    {
      icon: PartyPopper,
      title: 'ĐẶT TIỆC SINH NHẬT',
      description: 'Tổ chức tiệc sinh nhật vui vẻ với thực đơn đa dạng và không gian ấm cúng.'
    },
    {
      icon: Users,
      title: 'JOBILLEE KIDS CLUB',
      description: 'Câu lạc bộ dành cho trẻ em với nhiều hoạt động thú vị và quà tặng hấp dẫn.'
    },
    {
      icon: ShoppingBag,
      title: 'ĐƠN HÀNG LỚN',
      description: 'Phục vụ đơn hàng lớn cho sự kiện, tiệc công ty với giá ưu đãi đặc biệt.'
    }
  ];

  const homeNews = [
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/JED_Man.jpg',
      title: 'Jobillee ra mắt chiến dịch lan tỏa niềm vui',
      description: 'Cùng chung tay mang đến những nụ cười rạng rỡ, Jobillee chính thức khởi động chiến dịch cộng đồng.',
      date: '10/05/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/VN1.jpg',
      title: 'Khai trương cửa hàng thứ 150 tại Việt Nam',
      description: 'Đánh dấu cột mốc quan trọng, Jobillee hân hoan chào đón thành viên mới tại trung tâm TP.HCM.',
      date: '28/04/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/THUMBNAIL-04-06.jpg',
      title: 'Khuyến mãi cực hot - Mùa hè sôi động',
      description: 'Giải nhiệt mùa hè cùng hàng loạt ưu đãi giảm giá lên đến 30% cho các combo gia đình.',
      date: '15/04/2026'
    },
    {
      image: 'https://jollibee.com.vn/media/magefan_blog/thumbnail2.jpg',
      title: 'Giới thiệu thực đơn mới - Hương vị bùng nổ',
      description: 'Trải nghiệm ngay bộ sưu tập món mới với gà sốt cay đặc biệt và mỳ Ý phô mai.',
      date: '02/04/2026'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Jobillee Vietnam - Tận Hưởng Niềm Vui</title>
        <meta name="description" content="Khám phá hương vị tuyệt hảo của gà rán giòn tan, mỳ Ý đậm đà tại Jobillee Vietnam." />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section with Image Background */}
        <section className="relative py-32 md:py-48 px-4 text-center flex items-center justify-center min-h-[80dvh]">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <img 
              src="https://images.unsplash.com/photo-1572125345941-a0687d65b989" 
              alt="Món ăn thơm ngon tại Jobillee" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-white mt-12 md:mt-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg text-balance">
              TẬN HƯỞNG NIỀM VUI<br />MỖI NGÀY
            </h1>
            <p className="text-lg md:text-2xl text-white/95 max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-md">
              Khám phá hương vị gà giòn rụm và mỳ Ý đặc biệt tại Jobillee. Mang đến bữa ăn ngon miệng và niềm vui trọn vẹn cho gia đình bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/menu')}
                className="bg-[rgb(var(--jobillee-yellow))] hover:bg-white text-[rgb(var(--jobillee-dark))] hover:text-[rgb(var(--jobillee-red))] font-bold px-10 py-6 text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 border-none"
              >
                ĐẶT HÀNG NGAY
              </Button>
            </div>
          </div>
        </section>

        {/* Menu/Products Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                ĂN GÌ HÔM NAY
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Những món ngon được yêu thích nhất tại Jobillee, sẵn sàng phục vụ bạn bất cứ lúc nào.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {menuProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  buttonText={product.buttonText}
                  onClick={() => navigate('/menu')}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/menu')}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold px-8"
              >
                XEM TOÀN BỘ THỰC ĐƠN
              </Button>
            </div>
          </div>
        </section>

        {/* About Section - Brief Story */}
        <section className="py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://jollibee.com.vn/media/magefan_blog/VN1.jpg"
                  alt="Jobillee Store Experience"
                  className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  CÂU CHUYỆN<br />JOBILLEE
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Jobillee Việt Nam tự hào là chuỗi nhà hàng thức ăn nhanh mang đến không chỉ những món ăn chất lượng tuyệt hảo mà còn là không gian ấm cúng để gắn kết yêu thương.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Chúng tôi cam kết sử dụng nguyên liệu tươi ngon nhất, quy trình chế biến chuẩn quốc tế để phục vụ những bữa ăn dinh dưỡng, an toàn cho hàng triệu gia đình Việt.
                </p>
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/about')}
                    className="bg-primary hover:brightness-110 text-primary-foreground font-bold px-8"
                  >
                    VỀ CHÚNG TÔI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-primary/5 py-24 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                DỊCH VỤ NỔI BẬT
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tận hưởng những tiện ích trọn vẹn khi đến với Jobillee.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  onClick={() => navigate('/services')}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Blog / News Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  TIN TỨC & SỰ KIỆN
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Đừng bỏ lỡ những thông tin hấp dẫn, khuyến mãi và hoạt động mới nhất từ Jobillee.
                </p>
              </div>
              <Button 
                variant="link" 
                onClick={() => navigate('/news')}
                className="text-primary font-bold hover:no-underline hover:bg-primary/10 rounded-full px-6 shrink-0"
              >
                Xem tất cả bài viết &rarr;
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {homeNews.map((article, index) => (
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
