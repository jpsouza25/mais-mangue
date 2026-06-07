import React from 'react';
import { WaveDivider } from './WaveDivider';

interface WhyUseMangueProps {
  onDownloadClick: () => void;
}

export function WhyUseMangue({ onDownloadClick }: WhyUseMangueProps) {
  const appFeatures = [
    'Denuncie com foto e GPS em segundos',
    'Acompanhe o status de cada denúncia',
    'Ganhe Créditos Verdes ao participar',
    'Participe de mutirões de plantio e limpeza',
    '100% gratuito para cidadãos',
  ];

  const platformFeatures = [
    'Dashboard ESG em tempo real',
    'Cálculo automático de CO₂ compensado',
    'Relatórios prontos para GRI e auditoria',
    'Selo de Compensação alinhado à ODS 13',
    'Suporte dedicado para empresas',
  ];

  return (
    <section id="why-use" style={{ backgroundColor: '#F1F4E0' }}>
      <WaveDivider topColor="#F8FAF0" bottomColor="#F1F4E0" />

      <div className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="text-center mb-14">
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
              textTransform: 'uppercase',
            }}
          >
            💡 POR QUE USAR O +MANGUE?
          </div>

          <h2
            className="mb-4"
            style={{
              fontFamily: 'Lora, serif',
              fontWeight: 700,
              fontSize: '42px',
              lineHeight: '1.3',
              color: '#404925',
            }}
          >
            Tecnologia a serviço do meio ambiente
          </h2>

          <p
            className="mx-auto"
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '15px',
              color: '#A9B1B6',
              maxWidth: '600px',
              lineHeight: '1.7',
            }}
          >
            Desenvolvemos ferramentas que conectam quem quer ajudar com quem pode fazer a
            diferença. Escolha a solução ideal para você.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">

          <div
            className="flex flex-col relative overflow-hidden"
            style={{
              background: 'linear-gradient(150deg, #404925 0%, #2d3318 100%)',
              borderRadius: '28px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
            }}
          >
            <div
              className="px-8 pt-8 pb-6"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div
                className="inline-block px-3 py-1.5 mb-3"
                style={{
                  backgroundColor: 'rgba(175, 177, 28, 0.25)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '50px',
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  color: '#AFB11C',
                  textTransform: 'uppercase',
                }}
              >
                GRATUITO
              </div>
              <h3
                style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 700,
                  fontSize: '26px',
                  color: 'white',
                  lineHeight: '1.2',
                }}
              >
                +Mangue App
              </h3>
              <p
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)',
                  marginTop: '4px',
                }}
              >
                Para cidadãos e voluntários ambientais
              </p>
            </div>

            <div className="px-8 py-5">
              <p
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.75',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Já pensou em denunciar um crime ambiental com apenas uma foto? O +Mangue App
                coloca o poder de preservar na palma da sua mão. Cada denúncia gera dados
                reais que ajudam órgãos ambientais a agir mais rápido.
              </p>
            </div>

            <div className="px-8 pb-6 flex-1">
              <div className="space-y-3">
                {appFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(175, 177, 28, 0.25)',
                        color: '#AFB11C',
                        fontSize: '10px',
                        flexShrink: 0,
                      }}
                    >
                      ✦
                    </span>
                    <span
                      style={{
                        fontFamily: 'Work Sans, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.5',
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8 mt-2">
              <button
                onClick={onDownloadClick}
                className="w-full py-4 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  background: 'linear-gradient(90deg, #AFB11C 0%, #9a9c18 100%)',
                  color: '#2d3318',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(175,177,28,0.35)',
                  letterSpacing: '0.3px',
                }}
              >
                📱 Baixar para celular
              </button>
            </div>
          </div>

          <div
            className="flex flex-col relative overflow-hidden"
            style={{
              background: 'linear-gradient(150deg, #2e4a50 0%, #1c3a4a 100%)',
              borderRadius: '28px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
            }}
          >
            <div
              className="px-8 pt-8 pb-6"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div
                className="inline-block px-3 py-1.5 mb-3"
                style={{
                  backgroundColor: 'rgba(108, 148, 180, 0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '50px',
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  color: '#BCCFE0',
                  textTransform: 'uppercase',
                }}
              >
                PARA EMPRESAS
              </div>
              <h3
                style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 700,
                  fontSize: '26px',
                  color: 'white',
                  lineHeight: '1.2',
                }}
              >
                +Mangue Plataforma
              </h3>
              <p
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)',
                  marginTop: '4px',
                }}
              >
                ESG, carbono e impacto ambiental real
              </p>
            </div>

            <div className="px-8 py-5">
              <p
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.75',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Empresas que investem em ESG crescem 2x mais rápido. Com a plataforma, sua
                empresa compensa emissões de carbono de verdade — financiando a recuperação
                de manguezais e gerando relatórios automáticos.
              </p>
            </div>

            <div className="px-8 pb-6 flex-1">
              <div className="space-y-3">
                {platformFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(108, 148, 180, 0.35)',
                        color: '#BCCFE0',
                        fontSize: '10px',
                        flexShrink: 0,
                      }}
                    >
                      ✦
                    </span>
                    <span
                      style={{
                        fontFamily: 'Work Sans, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.5',
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8 mt-2">
              <button
                onClick={onDownloadClick}
                className="w-full py-4 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  background: 'linear-gradient(90deg, #6C94B4 0%, #5a82a2 100%)',
                  color: 'white',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(108,148,180,0.4)',
                  letterSpacing: '0.3px',
                }}
              >
                💻 Acessar Plataforma
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <div
            className="flex items-center gap-3 px-6 py-3"
            style={{
              backgroundColor: 'rgba(64, 73, 37, 0.08)',
              borderRadius: '50px',
              border: '1px solid rgba(64, 73, 37, 0.12)',
            }}
          >
            <span style={{ fontSize: '16px' }}>🌿</span>
            <span
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontSize: '13px',
                color: '#404925',
                fontWeight: 500,
              }}
            >
              Alinhado à ODS 13 — Ação Contra a Mudança Global do Clima
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}