import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Checkbox } from '../components/ui/checkbox.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Đăng nhập thành công');
        navigate(result.user?.role === 'store_manager' ? '/store' : '/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập - Jobillee Vietnam</title>
        <meta name="description" content="Đăng nhập vào tài khoản Jobillee để đặt hàng nhanh chóng và nhận ưu đãi đặc biệt." />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-400px)] bg-[rgb(var(--jobillee-cream))] py-20 flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ĐĂNG NHẬP
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="text-gray-900 border-gray-300 focus-visible:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu <span className="text-destructive">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="text-gray-900 border-gray-300 focus-visible:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" disabled={isLoading} />
                  <Label htmlFor="remember" className="text-sm cursor-pointer text-gray-600 font-normal">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-[hsl(var(--primary-hover))] active:bg-[hsl(var(--primary-active))] text-primary-foreground font-bold py-6 text-base transition-all duration-200 active:scale-98"
              >
                {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/signup" className="text-primary font-bold hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default LoginPage;
