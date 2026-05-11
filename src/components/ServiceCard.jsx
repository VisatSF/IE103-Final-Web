import React from 'react';
import { Button } from './ui/button.jsx';

function ServiceCard({ icon: Icon, title, description, onClick }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="mb-4">
        {Icon && <Icon className="h-12 w-12 text-[rgb(var(--jobillee-red))]" />}
      </div>
      <h3 className="text-xl font-bold text-[rgb(var(--jobillee-dark))] mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
        {description}
      </p>
      <Button 
        onClick={onClick}
        className="w-full bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-semibold transition-all duration-200 active:scale-98 mt-auto"
      >
        XEM THÊM
      </Button>
    </div>
  );
}

export default ServiceCard;