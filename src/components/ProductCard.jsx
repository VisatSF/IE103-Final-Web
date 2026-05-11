
import React from 'react';
import { ChevronRight } from 'lucide-react';

function ProductCard({ image, title, description, buttonText, onClick }) {
  return (
    <div 
      className="product-card group"
      onClick={onClick}
    >
      <div className="w-full aspect-square mb-4 overflow-hidden rounded-xl bg-muted/30">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h3 className="text-xl font-bold text-card-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
      )}
      <div className="mt-auto inline-flex items-center justify-center font-bold text-sm text-primary group-hover:text-[hsl(var(--primary-hover))] transition-colors">
        {buttonText || 'XEM NGAY'}
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default ProductCard;
