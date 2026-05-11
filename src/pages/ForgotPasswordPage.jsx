import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success('Neu email ton tai trong he thong, huong dan dat lai mat khau se duoc gui toi ban.');
    setEmail('');
  };

  return (
    <>
      <Helmet>
        <title>Quen mat khau - Jobillee Vietnam</title>
        <meta
          name="description"
          content="Gui yeu cau dat lai mat khau de tiep tuc su dung tai khoan Jobillee."
        />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-400px)] bg-[rgb(var(--jobillee-cream))] py-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-[rgb(var(--jobillee-yellow))]/40">
              <Mail className="h-8 w-8 text-[rgb(var(--jobillee-red))]" />
            </div>

            <h1 className="text-3xl font-bold text-[rgb(var(--jobillee-red))] mb-4 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              QUEN MAT KHAU
            </h1>
            <p className="text-gray-600 text-center leading-relaxed mb-8">
              Nhap email da dang ky. Chung toi se gui huong dan dat lai mat khau den hop thu cua ban.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 text-gray-900"
                  placeholder="email@example.com"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold py-6 transition-all duration-200 active:scale-98"
              >
                Gui yeu cau
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ForgotPasswordPage;
