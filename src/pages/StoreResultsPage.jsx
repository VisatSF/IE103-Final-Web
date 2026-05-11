import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { MapPin, Phone, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getStoresApi } from '@/lib/api.js';

function StoreResultsPage() {
  const [searchParams] = useSearchParams();
  const cityQuery = searchParams.get('city') || '';
  const districtQuery = searchParams.get('district') || '';
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStores() {
      try {
        setIsLoading(true);
        const response = await getStoresApi({
          city: cityQuery,
          district: districtQuery,
        });

        if (isMounted) {
          setStores(response.stores || []);
        }
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

    loadStores();

    return () => {
      isMounted = false;
    };
  }, [cityQuery, districtQuery]);

  return (
    <>
      <Helmet>
        <title>Kết quả tìm kiếm cửa hàng - Jobillee Vietnam</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[rgb(var(--jobillee-cream))] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/stores" className="inline-flex items-center text-[rgb(var(--jobillee-red))] font-semibold hover:underline mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại tìm kiếm
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[rgb(var(--jobillee-dark))]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Kết quả tìm kiếm
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {isLoading ? 'Đang tải...' : `${stores.length} cửa hàng được tìm thấy`}
            </p>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-600">
              Đang tải danh sách cửa hàng từ MySQL...
            </div>
          ) : stores.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy cửa hàng nào</h2>
              <p className="text-gray-500 mb-8">Vui lòng thử lại với khu vực khác.</p>
              <Button asChild variant="outline">
                <Link to="/stores">Tìm kiếm lại</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-[rgb(var(--jobillee-red))] mb-4">
                    {store.name}
                  </h3>
                  <div className="space-y-3 text-gray-600 flex-grow">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-900 leading-snug">{store.address}</p>
                        <p className="text-sm text-gray-500">{store.districtName}, {store.cityName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${store.phone}`} className="text-gray-900 hover:text-[rgb(var(--jobillee-red))] font-medium">
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <p className="text-gray-900">{store.hours}</p>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-6 bg-[rgb(var(--jobillee-yellow))] hover:bg-[rgb(var(--jobillee-yellow))]/90 text-[rgb(var(--jobillee-dark))] font-bold shadow-sm">
                    <a href={store.mapUrl || '#'} target="_blank" rel="noreferrer">
                      Xem đường đi
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default StoreResultsPage;
