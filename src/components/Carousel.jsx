import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button.jsx';

function Carousel({ images = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const defaultImages = [
    'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/6ff5ddda09795af25ef5702fbab7fc89.png',
    'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/f08319569cfa954a05cad939a4079a2b.png',
    'https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/284eca44fa6db807fc3fc627d9657ec5.png'
  ];

  const carouselImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="relative w-full">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {carouselImages.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                <img 
                  src={image} 
                  alt={`Jobillee product showcase ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === selectedIndex 
                ? 'bg-[rgb(var(--jobillee-yellow))] scale-110' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 flex-wrap justify-center px-4">
        <Button 
          size="lg"
          className="bg-[rgb(var(--jobillee-red))] hover:bg-[rgb(var(--jobillee-red))]/90 text-white font-semibold px-8 py-6 text-base transition-all duration-200 active:scale-95"
        >
          GIAO HÀNG TẬN NƠI
        </Button>
        <Button 
          size="lg"
          variant="secondary"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-6 text-base transition-all duration-200 active:scale-95"
        >
          ĐẶT ĐẾN LẤY
        </Button>
      </div>
    </div>
  );
}

export default Carousel;