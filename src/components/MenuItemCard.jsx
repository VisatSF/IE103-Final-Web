
import React, { useState } from 'react';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { useCart } from '@/contexts/CartContext.jsx';

export default function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const [imgStatus, setImgStatus] = useState('loading');

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`Đã thêm ${item.name} - ${item.price} vào giỏ hàng`, {
      duration: 3000,
    });
  };

  return (
    <div className="product-card group p-0 !items-stretch">
      {/* Image Display Area - Positioned explicitly above the content */}
      <div className="aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden w-full">
        {item.image ? (
          <>
            {imgStatus === 'loading' && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img 
              src={item.image} 
              alt={item.name} 
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                imgStatus === 'loaded' ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
              }`} 
            />
            {imgStatus === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 bg-muted">
                <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-sm font-medium">Lỗi tải ảnh</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/50 p-4 text-center">
            <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
            <span className="text-sm font-medium">Chưa có ảnh</span>
          </div>
        )}
        
        {/* Optional Badge */}
        {item.isNew && (
          <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            MỚI
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-bold text-lg leading-tight text-card-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-bold text-[hsl(var(--menu-price-color))] whitespace-nowrap text-lg">
            {item.price}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-2">
          {item.description || 'Món ăn thơm ngon, đậm đà hương vị đặc trưng của Jobillee.'}
        </p>
        
        <Button 
          className="w-full mt-auto gap-2 font-bold rounded-xl" 
          variant="default"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
}
