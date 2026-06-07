import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  onCTAClick: () => void;
}

export function HeroCarousel({ onCTAClick }: HeroCarouselProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ bottom: '40px' }}>
        <ul className="flex items-center justify-center gap-2"> 
          {React.Children.map(dots as React.ReactElement, (child, index) => {
            const isActive = child.props.className?.includes('slick-active');
            return (
              <li key={index}>
                <button
                  onClick={child.props.children.props.onClick}
                  className="transition-all"
                  style={{
                    width: isActive ? '40px' : '8px',
                    height: '8px',
                    borderRadius: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    )
  };

  return (
    <div className="relative" style={{ height: 'calc(100vh - 80px)' }}>
      <Slider ref={sliderRef} {...settings}>
        <div>
          <div 
            className="relative flex items-center"
            style={{ 
              height: 'calc(100vh - 80px)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1766981935795-b1270efc9c47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5ncm92ZSUyMGZvcmVzdCUyMHJvb3RzJTIwd2F0ZXIlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzU5OTk5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(10,30,18,0.75) 0%, rgba(20,50,35,0.55) 100%)'
              }}
            />
            
            <div className="relative max-w-[1440px] mx-auto px-8 w-full">
              <div className="max-w-[600px]">
                <div 
                  className="inline-block px-4 py-2 mb-6"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '50px',
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    color: 'white',
                    textTransform: 'uppercase'
                  }}
                >
                  PARA A POPULAÇÃO
                </div>
                
                <h1 
                  className="mb-5"
                  style={{
                    fontFamily: 'Lora, serif',
                    fontWeight: 700,
                    fontSize: '54px',
                    lineHeight: '1.2',
                    color: 'white'
                  }}
                >
                  Proteja os manguezais do Recife
                </h1>
                
                <p 
                  className="mb-8"
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.88)',
                    maxWidth: '540px'
                  }}
                >
                  Denuncie problemas ambientais, acompanhe ações e participe ativamente da preservação dos ecossistemas que protegem nossa cidade.
                </p>
                
                <button
                  onClick={onCTAClick}
                  className="px-8 py-4 transition-all hover:opacity-90"
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    backgroundColor: '#6C94B4',
                    color: 'white',
                    borderRadius: '60px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Conhecer o App ↓
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div 
            className="relative flex items-center"
            style={{ 
              height: 'calc(100vh - 80px)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1761467238274-f1d12fe98772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5ncm92ZSUyMHN3YW1wJTIwd2F0ZXIlMjBsZXZlbHxlbnwxfHx8fDE3NzU5OTk5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(10,30,18,0.75) 0%, rgba(20,50,35,0.55) 100%)'
              }}
            />
            
            <div className="relative max-w-[1440px] mx-auto px-8 w-full">
              <div className="max-w-[600px]">
                <div 
                  className="inline-block px-4 py-2 mb-6"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '50px',
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    color: 'white',
                    textTransform: 'uppercase'
                  }}
                >
                  PARA EMPRESAS
                </div>
                
                <h1 
                  className="mb-5"
                  style={{
                    fontFamily: 'Lora, serif',
                    fontWeight: 700,
                    fontSize: '54px',
                    lineHeight: '1.2',
                    color: 'white'
                  }}
                >
                  ESG e compensação de carbono real
                </h1>
                
                <p 
                  className="mb-8"
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.88)',
                    maxWidth: '540px'
                  }}
                >
                  Dashboard ESG completo, cálculo de CO₂ compensado e relatórios automáticos por meio da recuperação de manguezais urbanos.
                </p>
                
                <button
                  onClick={onCTAClick}
                  className="px-8 py-4 transition-all hover:opacity-90"
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    backgroundColor: '#AFB11C',
                    color: '#404925',
                    borderRadius: '60px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Conhecer a Plataforma ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </Slider>

      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center transition-all hover:bg-white/20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center transition-all hover:bg-white/20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}