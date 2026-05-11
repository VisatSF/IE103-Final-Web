import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import AddAddressModal from '@/components/AddAddressModal.jsx';

export default function DeliveryAddressPage() {
  const { user, addAddress } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAddress = (newAddress) => {
    addAddress(newAddress);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const addresses = user.addresses || [];

  return (
    <>
      <Helmet>
        <title>Địa chỉ giao hàng - Jobillee Vietnam</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-muted/20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-bold text-primary">Địa chỉ giao hàng</h1>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 font-bold">
              <Plus className="w-4 h-4" />
              Thêm Địa Chỉ Mới
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-card rounded-2xl shadow-sm p-12 text-center border border-border/50">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Chưa có địa chỉ nào</h2>
              <p className="text-muted-foreground mb-6">Bạn chưa lưu địa chỉ giao hàng nào. Hãy thêm địa chỉ để đặt hàng nhanh chóng hơn.</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="font-bold">
                Thêm địa chỉ ngay
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-card rounded-2xl shadow-sm p-6 border border-border/50 flex justify-between items-start">
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{addr.recipientName}</h3>
                        <span className="text-muted-foreground">|</span>
                        <span className="font-medium">{addr.phone}</span>
                      </div>
                      <p className="text-muted-foreground">{addr.address}</p>
                      <p className="text-muted-foreground">{addr.city}, {addr.postalCode}</p>
                      {addr.notes && <p className="text-sm text-muted-foreground mt-2 italic">Ghi chú: {addr.notes}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" className="text-primary font-medium hover:bg-primary/10">
                    Sửa
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AddAddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddAddress} 
      />

      <Footer />
    </>
  );
}