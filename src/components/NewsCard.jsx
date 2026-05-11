
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

function NewsCard({ image, title, description, date, onClick }) {
  return (
    <div 
      className="news-card group cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 line-clamp-3 text-base flex-grow">
          {description}
        </p>
        
        <div className="mt-auto flex items-center text-primary font-semibold text-sm group-hover:underline">
          Đọc tiếp
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
