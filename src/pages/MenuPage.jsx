import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import { getMenuApi } from '@/lib/api.js';

function formatVnd(amount) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(amount) || 0)}đ`;
}

const fallbackImageByCategory = {
  'combo-ban-chay': '/combo-ca-nha-no-ne.jpg',
  'ga-gion': '/1-mieng-ga-gion.webp',
  'my-y': '/my-y-sot-bo-bam-vua.jpg',
  'ga-cay': '/com-ga-sot-cay.jpg',
  burger: '/burger-ga-gion.webp',
  'an-phu': '/khoai-tay-chien-lon.jpg',
  'trang-mieng': '/tropical-sundae.webp',
  'thuc-uong': '/pepsi-vua.webp',
};

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        setIsLoading(true);
        const response = await getMenuApi();

        if (!isMounted) {
          return;
        }

        setCategories(response.categories || []);
        setMenuItems(response.items || []);
        setActiveCategory((current) => current || response.categories?.[0]?.id || '');
      } catch (error) {
        if (isMounted) {
          toast.error(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeItems = useMemo(
    () => menuItems
      .filter((item) => item.categoryId === activeCategory)
      .map((item) => {
        return {
          ...item,
          price: formatVnd(item.price),
          parsedPrice: Number(item.price),
          image: item.imageUrl || fallbackImageByCategory[item.categoryId] || '',
        };
      }),
    [activeCategory, menuItems]
  );

  const scroll = (direction) => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth / 2;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Helmet>
        <title>Thực đơn - Jobillee Vietnam</title>
        <meta name="description" content="Khám phá thực đơn Jobillee đang được tải trực tiếp từ hệ thống dữ liệu MySQL." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-muted/30 pb-24">
        <section className="sticky top-[88px] md:top-[104px] z-40 bg-background/95 backdrop-blur-md border-b shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => scroll('left')}
                className="hidden md:flex p-2 rounded-full hover:bg-muted text-primary shrink-0 transition-colors shadow-sm bg-card border"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-3 pb-2 -mb-2 snap-x flex-1 scroll-smooth items-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style dangerouslySetInnerHTML={{ __html: 'div::-webkit-scrollbar { display: none; }' }} />

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`snap-start shrink-0 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-[rgb(var(--jobillee-yellow))] text-[rgb(var(--jobillee-dark))] ring-2 ring-offset-2 ring-[rgb(var(--jobillee-yellow))] shadow-md'
                        : 'bg-white text-[rgb(var(--jobillee-dark))] border border-border hover:bg-muted'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scroll('right')}
                className="hidden md:flex p-2 rounded-full hover:bg-muted text-primary shrink-0 transition-colors shadow-sm bg-card border"
                aria-label="Next categories"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-md">
              Đang tải thực đơn từ MySQL...
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {activeItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && activeItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-md">
              Chưa có món nào trong danh mục này.
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MenuPage;
