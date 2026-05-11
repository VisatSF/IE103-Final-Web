
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Phone, MapPin, Mail } from 'lucide-react';
import JobilleeLogo from './JobilleeLogo.jsx';

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <JobilleeLogo className="h-12 w-12" />
              <span className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
                JOBILLEE
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  Công ty TNHH Jobillee Việt Nam<br />
                  Tầng 5, Tòa nhà Sài Gòn Centre<br />
                  65 Lê Lợi, Quận 1, TP.HCM
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <p>Hotline: 1900-1533</p>
              </div>
              <p className="text-xs opacity-90">
                Mã số thuế: 0123456789
              </p>
            </div>
          </div>

          {/* Center Column - Contact & Links */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              LIÊN HỆ
            </h3>
            <div className="mb-6">
              <div className="inline-block bg-[rgb(var(--jobillee-yellow))] text-[rgb(var(--jobillee-dark))] px-4 py-2 rounded-lg font-bold text-lg mb-4">
                1900-1533
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@jobillee.vn" className="hover:text-white/80 transition-colors">
                  info@jobillee.vn
                </a>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <Link to="/privacy" className="block hover:text-white/80 transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="block hover:text-white/80 transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="/cookies" className="block hover:text-white/80 transition-colors">
                Chính sách Cookie
              </Link>
            </div>
          </div>

          {/* Right Column - Social & Apps */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>
            <div className="space-y-4">
              <a 
                href="https://facebook.com/jobillee" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white/80 transition-colors duration-200"
              >
                <Facebook className="h-6 w-6" />
                <span className="text-sm">Facebook</span>
              </a>
              
              <div className="pt-4">
                <p className="text-sm font-semibold mb-3">Tải ứng dụng:</p>
                <div className="flex flex-col gap-2">
                  <a 
                    href="#" 
                    className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-95"
                  >
                    Google Play
                  </a>
                  <a 
                    href="#" 
                    className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-95"
                  >
                    App Store
                  </a>
                </div>
              </div>

              <button className="text-sm underline hover:no-underline transition-all duration-200">
                Cài đặt Cookie
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-90">
          <p>© 2026 Jobillee. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
