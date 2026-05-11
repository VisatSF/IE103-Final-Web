import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Liên hệ - Jobillee Vietnam</title>
        <meta name="description" content="Liên hệ với Jobillee Vietnam. Gửi câu hỏi, góp ý hoặc yêu cầu hỗ trợ. Chúng tôi luôn sẵn sàng lắng nghe." />
      </Helmet>

      <Header />

      <main>
        <section className="relative h-[300px] bg-gradient-to-r from-[rgb(var(--jobillee-red))] to-[rgb(var(--jobillee-red))]/80">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                LIÊN HỆ
              </h1>
              <p className="text-xl md:text-2xl">
                Chúng tôi luôn sẵn sàng lắng nghe
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-[rgb(var(--jobillee-red))] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Gửi tin nhắn
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Tiêu đề *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-bold py-6 transition-all duration-200 active:scale-98"
                  >
                    Gửi tin nhắn
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[rgb(var(--jobillee-red))] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Thông tin liên hệ
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[rgb(var(--jobillee-red))] rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[rgb(var(--jobillee-dark))] mb-1">Địa chỉ</h3>
                      <p className="text-gray-600">
                        Tầng 5, Tòa nhà Sài Gòn Centre<br />
                        65 Lê Lợi, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[rgb(var(--jobillee-red))] rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[rgb(var(--jobillee-dark))] mb-1">Hotline</h3>
                      <a href="tel:19001533" className="text-gray-600 hover:text-[rgb(var(--jobillee-red))]">
                        1900-1533
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[rgb(var(--jobillee-red))] rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[rgb(var(--jobillee-dark))] mb-1">Email</h3>
                      <a href="mailto:info@jobillee.vn" className="text-gray-600 hover:text-[rgb(var(--jobillee-red))]">
                        info@jobillee.vn
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[rgb(var(--jobillee-red))] rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[rgb(var(--jobillee-dark))] mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600">
                        Thứ 2 - Chủ nhật: 8:00 - 22:00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-[rgb(var(--jobillee-cream))] rounded-xl p-6">
                  <h3 className="font-bold text-[rgb(var(--jobillee-dark))] mb-3">Câu hỏi thường gặp</h3>
                  <p className="text-gray-600 mb-4">
                    Bạn có thể tìm câu trả lời nhanh chóng cho các câu hỏi phổ biến trong phần FAQ của chúng tôi.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-[rgb(var(--jobillee-red))] text-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))] hover:text-white transition-all duration-200"
                  >
                    Xem FAQ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ContactPage;