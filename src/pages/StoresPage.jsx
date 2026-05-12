import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { MapPin, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getStoresApi, getStoresMetaApi } from '@/lib/api.js';

function StoresPage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDistrictsAndStores() {
      try {
        setIsLoading(true);
        const [{ cities: nextCities, districts: nextDistricts }, { stores: nextStores }] = await Promise.all([
          getStoresMetaApi(selectedCity),
          getStoresApi({ city: selectedCity, district: selectedDistrict }),
        ]);

        if (!isMounted) {
          return;
        }

        setCities(nextCities || []);
        setDistricts(nextDistricts || []);

        const uniqueStores = Array.from(
          new Map((nextStores || []).map((store) => [store.id, store])).values()
        );
        setStores(uniqueStores);
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

    loadDistrictsAndStores();

    return () => {
      isMounted = false;
    };
  }, [selectedCity, selectedDistrict]);

  return (
    <>
      <Helmet>
        <title>Cửa hàng - Jobillee Vietnam</title>
        <meta name="description" content="Danh sách cửa hàng đang được tải trực tiếp từ dữ liệu hệ thống Jobillee." />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[300px] bg-gradient-to-r from-[rgb(var(--jobillee-orange))] to-[rgb(var(--jobillee-yellow))]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-[rgb(var(--jobillee-dark))]">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                CỬA HÀNG
              </h1>
              <p className="text-xl md:text-2xl">Tìm Jobillee gần bạn</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[rgb(var(--jobillee-cream))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
              <h2 className="text-3xl font-bold text-[rgb(var(--jobillee-red))] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Tìm cửa hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedCity || 'all'} onValueChange={(value) => {
                  setSelectedCity(value === 'all' ? '' : value);
                  setSelectedDistrict('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh thành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.slug} value={city.slug}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDistrict || 'all'} onValueChange={(value) => setSelectedDistrict(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district.slug} value={district.slug}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold">
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-md">
                Đang tải danh sách cửa hàng từ MySQL...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                  <div key={store.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-[rgb(var(--jobillee-dark))] mb-4">
                      {store.name}
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-[rgb(var(--jobillee-red))] flex-shrink-0 mt-0.5" />
                        <div>
                          <p>{store.address}</p>
                          <p className="text-sm text-gray-500">
                            {store.districtName}, {store.cityName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-[rgb(var(--jobillee-red))] flex-shrink-0" />
                        <a href={`tel:${store.phone}`} className="hover:text-[rgb(var(--jobillee-red))]">
                          {store.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[rgb(var(--jobillee-red))] flex-shrink-0" />
                        <p>{store.hours}</p>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-4 bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-semibold"
                    >
                      <a href={store.mapUrl || '#'} target="_blank" rel="noreferrer">
                        Xem chỉ đường
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && stores.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-600 shadow-md">
                Không tìm thấy cửa hàng phù hợp với bộ lọc đã chọn.
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default StoresPage;
