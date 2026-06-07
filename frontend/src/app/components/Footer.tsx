import React from 'react';
import logoClaro from '../../assets/logo-light.jpeg';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#404925' }}>
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img
                src={logoClaro}
                alt="+Mangue"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                }}
              />
            </div>
            <p 
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              Tecnologia para preservação dos manguezais urbanos do Recife. ODS 13.
            </p>
          </div>

          <div>
            <h4 
              className="mb-4"
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '1.2px',
                color: 'white',
                textTransform: 'uppercase'
              }}
            >
              PRODUTO
            </h4>
            <div className="space-y-2">
              {['+Mangue App', '+Mangue Plataforma', 'Crédito Verde'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block transition-colors hover:text-[#AFB11C]"
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none'
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 
              className="mb-4"
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '1.2px',
                color: 'white',
                textTransform: 'uppercase'
              }}
            >
              SOBRE
            </h4>
            <div className="space-y-2">
              {['O Projeto', 'ODS 13', 'Blog'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block transition-colors hover:text-[#AFB11C]"
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none'
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 
              className="mb-4"
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '1.2px',
                color: 'white',
                textTransform: 'uppercase'
              }}
            >
              CONTATO
            </h4>
            <div className="space-y-2">
              {[
                'contato@maismangue.com.br',
                '(81) 9 0000-0000',
                '@maismangue',
                'Recife — PE'
              ].map((info) => (
                <div
                  key={info}
                  style={{
                    fontFamily: 'Work Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <p 
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            © 2026 +Mangue
          </p>
          <p 
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            ODS 13 — Ação Contra a Mudança Global do Clima
          </p>
        </div>
      </div>
    </footer>
  );
}