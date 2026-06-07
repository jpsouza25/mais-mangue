import React from 'react';
import { WaveDivider } from './WaveDivider';

export function DidYouKnow() {
  const facts = [
    {
      icon: '🌊',
      title: 'Proteção costeira',
      description: 'Barreiras naturais contra enchentes, ressacas e erosão, protegendo comunidades litorâneas.',
      bgColor: 'rgba(108, 148, 180, 0.08)'
    },
    {
      icon: '🐟',
      title: 'Berçário marinho',
      description: 'Até 80% das espécies marinhas comerciais dependem dos manguezais em alguma fase da vida.',
      bgColor: 'rgba(164, 170, 127, 0.08)'
    },
    {
      icon: '🌱',
      title: '5x mais carbono',
      description: 'Capturam até 5 vezes mais CO₂ que florestas terrestres por hectare.',
      bgColor: 'rgba(175, 177, 28, 0.08)'
    },
    {
      icon: '🏘️',
      title: 'Sustento local',
      description: 'Milhares de famílias no Recife vivem da pesca artesanal e coleta de mariscos nos manguezais.',
      bgColor: 'rgba(116, 75, 38, 0.08)'
    }
  ];

  return (
    <section style={{ backgroundColor: '#F1F4E0' }}>
      <WaveDivider topColor="#16301f" bottomColor="#F1F4E0" />
      
      <div className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <div 
            className="inline-block px-4 py-2 mb-6"
            style={{
              backgroundColor: '#BCCFE0',
              borderRadius: '50px',
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '1.5px',
              color: '#404925',
              textTransform: 'uppercase'
            }}
          >
            🌿 VOCÊ SABIA?
          </div>
          
          <h2 
            className="mb-4"
            style={{
              fontFamily: 'Lora, serif',
              fontWeight: 700,
              fontSize: '42px',
              lineHeight: '1.3',
              color: '#404925'
            }}
          >
            Os manguezais são essenciais para a vida
          </h2>
          
          <p 
            className="mx-auto"
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '15px',
              color: '#A9B1B6',
              maxWidth: '540px'
            }}
          >
            Descubra por que esses ecossistemas únicos são fundamentais para o equilíbrio ambiental e o bem-estar das comunidades costeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((fact, index) => (
            <div
              key={index}
              className="p-6 transition-all hover:-translate-y-1"
              style={{
                backgroundColor: '#F8FAF0',
                borderRadius: '16px',
                border: '1px solid rgba(64, 73, 37, 0.08)',
                boxShadow: '0 2px 8px rgba(64, 73, 37, 0.03)'
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-4 text-2xl"
                style={{
                  backgroundColor: fact.bgColor,
                  borderRadius: '12px'
                }}
              >
                {fact.icon}
              </div>
              
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#404925'
                }}
              >
                {fact.title}
              </h3>
              
              <p 
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#A9B1B6'
                }}
              >
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
