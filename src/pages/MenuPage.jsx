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

function normalizeItemName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  const imageUrlMap = {

    'combo mot minh an ngon': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/c/a/cap_doi_an_y_78k_1g1m-compressed.jpg',
    'combo cap doi an y 1': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/c/a/cap_doi_an_y__2g2m-compressed.jpg',
    'combo cap doi an y 2': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/c/a/cap_doi_an_y_145k_3g1m-compressed.jpg',
    'combo ca nha no ne': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/c/a/cap_doi_an_y_185k_3g2m-compressed.jpg',

    '1 mieng ga gion': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_8_1_1.png',
    '2 mieng ga gion': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_6_7_2.png',
    '4 mieng ga gion': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_6_7_2_1.png',
    '6 mieng ga gion': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_1_1.png',
    '2 ga khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_2.png',
    'com ga sup nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_3.png',
    '1 ga khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_gi_n_vui_v_-_4.png',
    
    'my y sot bo bam vua': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_jolly_-_1-compressed.jpg',
    'my y sot bo bam lon': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_jolly_-_2-compressed.jpg',
    'ga my y nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_jolly_-_3.png',
    'my lon 2 ga xl khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_jolly_-_4-compressed_1.jpg',
    'my lon 2 ga xl nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_jolly_-_5-compressed_1.jpg',
    
    'com ga sot cay': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_6-compressed_1.jpg',
    '2 mieng ga sot cay': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_1-compressed.jpg',
    '2 ga cay khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_2-compressed.jpg',
    'com ga cay nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_3-compressed.jpg',
    'com ga cay sup nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_4-compressed.jpg',
    '1 ga cay khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_5-compressed.jpg',
    '1 mieng ga sot cay': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/g/_/g_s_t_cay_-_7-compressed.jpg',
    
    'burger ga gion nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/b/u/burger_-_1.png',
    'burger bbq khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/b/u/burger_-_2.png',
    'burger bbq nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/b/u/burger_-_3.png',
    'burger bbq': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/b/u/burger_-_4.png',
    'burger ga gion': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/b/u/burger_-_5.png',
    'burger ga gion khoai nuoc': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/b/u/burger_-_6.png',
    
    'khoai tay chien lon': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/p/h/ph_n_n_ph_-_1_2-compressed_1_1.jpg',
    'khoai vien rong bien': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/p/h/ph_n_n_ph_-_3_4-compressed_1.jpg',
    'canh ga sot tieu': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/p/h/ph_n_n_ph_-_5.png',
    'khoai tay chien vua': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/p/h/ph_n_n_ph_-_6.png',
    
    'banh xoai dao': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_n_tr_ng_mi_ng_-_1.png',
    'tropical sundae': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_n_tr_ng_mi_ng_-_2.png',
    'banh pie nhan khoai mon': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_n_tr_ng_mi_ng_-_3.png',
    'kem sua tuoi': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_n_tr_ng_mi_ng_-_4.png',
    'kem socola': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_n_tr_ng_mi_ng_-_5.png',
    'kem sundae dau': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/m/_/m_n_tr_ng_mi_ng_-_6.png',
    
    'pepsi vua': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/t/h/th_c_u_ng_-_1.png',
    '7up vua': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/t/h/th_c_u_ng_-_5_6_1.png',
    'mirinda vua': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/t/h/th_c_u_ng_-_7_8_1.png',
    'pepsi lon': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/t/h/th_c_u_ng_-_9_10_1.png',
    '7up lon': 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/t/h/th_c_u_ng_-_11_12_1.png'
  };

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
        const normalizedName = normalizeItemName(item.name);
        const mappedImageUrl = imageUrlMap[normalizedName];
        
        return {
          ...item,
          price: formatVnd(item.price),
          parsedPrice: Number(item.price),
          image: item.imageUrl || mappedImageUrl || '',
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
