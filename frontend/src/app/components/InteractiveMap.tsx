import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WaveDivider } from './WaveDivider';

type LatLngTuple = [number, number];

interface MangroveArea {
  id: number;
  name: string;
  hectares: number;
  type: 'preserved' | 'pressure' | 'urban';
  description: string;
  center: LatLngTuple;
  polygon: LatLngTuple[];
}

const mangroveAreas: MangroveArea[] = [
  {
    id: 1,
    name: 'Complexo de Goiana',
    hectares: 2800,
    type: 'preserved',
    description: 'Maior complexo estuarino de PE, com 2.800 ha de manguezais preservados. Rio Goiana forma um dos mais importantes estuários do estado.',
    center: [-7.565, -34.985],
    polygon: [
      [-7.510, -34.920], [-7.520, -34.940], [-7.535, -34.960],
      [-7.550, -34.975], [-7.565, -34.990], [-7.580, -35.010],
      [-7.600, -35.030], [-7.620, -35.045], [-7.615, -35.060],
      [-7.595, -35.050], [-7.575, -35.035], [-7.555, -35.015],
      [-7.540, -34.998], [-7.525, -34.975], [-7.515, -34.950],
      [-7.505, -34.932],
    ],
  },
  {
    id: 2,
    name: 'Ilha de Itamaracá',
    hectares: 1350,
    type: 'preserved',
    description: 'Canal de Santa Cruz e estuário formam 1.350 ha de manguezais ao redor da ilha. Área de berçário para espécies marinhas.',
    center: [-7.755, -34.875],
    polygon: [
      [-7.705, -34.840], [-7.720, -34.848], [-7.740, -34.855],
      [-7.758, -34.862], [-7.775, -34.870], [-7.790, -34.878],
      [-7.800, -34.890], [-7.795, -34.902], [-7.782, -34.895],
      [-7.768, -34.888], [-7.752, -34.880], [-7.735, -34.872],
      [-7.718, -34.862], [-7.703, -34.850],
    ],
  },
  {
    id: 3,
    name: 'Igarassu',
    hectares: 820,
    type: 'preserved',
    description: 'Rio Igarassu delimita 820 ha de manguezais entre estuários preservados ao norte da Região Metropolitana do Recife.',
    center: [-7.870, -34.920],
    polygon: [
      [-7.840, -34.895], [-7.852, -34.905], [-7.862, -34.915],
      [-7.873, -34.925], [-7.882, -34.935], [-7.890, -34.948],
      [-7.886, -34.960], [-7.875, -34.952], [-7.863, -34.940],
      [-7.852, -34.928], [-7.843, -34.915], [-7.835, -34.902],
    ],
  },
  {
    id: 4,
    name: 'Recife — Rio Beberibe',
    hectares: 480,
    type: 'urban',
    description: 'Manguezais urbanos do Rio Beberibe, cortando os bairros de Recife e Olinda. Sofre pressão do adensamento urbano mas ainda preserva 480 ha.',
    center: [-7.980, -34.890],
    polygon: [
      [-7.950, -34.875], [-7.960, -34.880], [-7.970, -34.885],
      [-7.980, -34.890], [-7.990, -34.898], [-8.000, -34.905],
      [-8.008, -34.915], [-8.003, -34.925], [-7.992, -34.918],
      [-7.980, -34.908], [-7.968, -34.898], [-7.957, -34.887],
      [-7.945, -34.878],
    ],
  },
  {
    id: 5,
    name: 'Recife — Rio Capibaribe',
    hectares: 620,
    type: 'urban',
    description: 'Manguezais do Rio Capibaribe no coração de Recife. Área-símbolo do projeto +Mangue, com 620 ha em zona urbana densamente ocupada.',
    center: [-8.055, -34.910],
    polygon: [
      [-8.020, -34.880], [-8.030, -34.888], [-8.040, -34.895],
      [-8.050, -34.905], [-8.060, -34.915], [-8.068, -34.928],
      [-8.075, -34.942], [-8.070, -34.955], [-8.060, -34.948],
      [-8.050, -34.935], [-8.040, -34.922], [-8.030, -34.910],
      [-8.020, -34.898], [-8.012, -34.885],
    ],
  },
  {
    id: 6,
    name: 'Parque dos Manguezais',
    hectares: 320,
    type: 'preserved',
    description: 'Unidade de Conservação Municipal de Recife com 320 ha. Localizado na zona sul da cidade, é o principal refúgio de fauna aquática urbana.',
    center: [-8.115, -34.945],
    polygon: [
      [-8.095, -34.928], [-8.103, -34.934], [-8.110, -34.940],
      [-8.118, -34.948], [-8.125, -34.958], [-8.128, -34.968],
      [-8.122, -34.975], [-8.112, -34.968], [-8.103, -34.958],
      [-8.096, -34.948], [-8.090, -34.937],
    ],
  },
  {
    id: 7,
    name: 'Jaboatão dos Guararapes',
    hectares: 740,
    type: 'pressure',
    description: 'Rios Jaboatão e Pirapama formam 740 ha de manguezais sob forte pressão industrial e de expansão urbana na região metropolitana.',
    center: [-8.195, -34.990],
    polygon: [
      [-8.170, -34.965], [-8.180, -34.975], [-8.190, -34.985],
      [-8.200, -34.998], [-8.208, -35.010], [-8.212, -35.022],
      [-8.206, -35.032], [-8.195, -35.025], [-8.185, -35.012],
      [-8.175, -35.000], [-8.165, -34.988], [-8.160, -34.972],
    ],
  },
  {
    id: 8,
    name: 'Cabo de Santo Agostinho',
    hectares: 1050,
    type: 'preserved',
    description: 'Estuários dos rios Pirapama e Ipojuca preservam 1.050 ha de manguezais no município de Cabo de Santo Agostinho.',
    center: [-8.295, -35.030],
    polygon: [
      [-8.260, -35.005], [-8.273, -35.013], [-8.283, -35.022],
      [-8.293, -35.033], [-8.302, -35.045], [-8.308, -35.057],
      [-8.304, -35.068], [-8.292, -35.060], [-8.281, -35.048],
      [-8.270, -35.036], [-8.260, -35.022], [-8.253, -35.009],
    ],
  },
  {
    id: 9,
    name: 'Complexo de Suape',
    hectares: 950,
    type: 'pressure',
    description: 'Porto de Suape e refinaria RNEST circundam 950 ha de manguezais. Uma das áreas mais ameaçadas do estado pelo avanço industrial.',
    center: [-8.400, -35.010],
    polygon: [
      [-8.360, -34.978], [-8.372, -34.985], [-8.383, -34.995],
      [-8.395, -35.005], [-8.408, -35.018], [-8.418, -35.030],
      [-8.422, -35.042], [-8.415, -35.052], [-8.402, -35.044],
      [-8.390, -35.033], [-8.378, -35.020], [-8.366, -35.007],
      [-8.355, -34.992],
    ],
  },
  {
    id: 10,
    name: 'Sirinhaém',
    hectares: 1450,
    type: 'preserved',
    description: 'Extenso complexo estuarino com 1.450 ha preservados. O Rio Sirinhaém abriga uma das maiores populações de Ariranha do estado.',
    center: [-8.595, -35.115],
    polygon: [
      [-8.555, -35.082], [-8.568, -35.090], [-8.580, -35.100],
      [-8.592, -35.112], [-8.602, -35.125], [-8.608, -35.138],
      [-8.604, -35.150], [-8.592, -35.142], [-8.580, -35.130],
      [-8.568, -35.118], [-8.556, -35.105], [-8.547, -35.090],
    ],
  },
  {
    id: 11,
    name: 'Tamandaré / Rio Formoso',
    hectares: 870,
    type: 'preserved',
    description: 'Próximo à Reserva Biológica do Saltinho, os 870 ha de manguezais de Tamandaré são protegidos pela legislação federal.',
    center: [-8.760, -35.110],
    polygon: [
      [-8.722, -35.082], [-8.735, -35.090], [-8.747, -35.098],
      [-8.758, -35.108], [-8.768, -35.120], [-8.775, -35.132],
      [-8.773, -35.145], [-8.760, -35.138], [-8.748, -35.126],
      [-8.737, -35.114], [-8.726, -35.101], [-8.717, -35.088],
    ],
  },
];

const typeConfig = {
  preserved: {
    color: '#2d5a1b',
    fillColor: '#4a7c2e',
    fillOpacity: 0.5,
    label: 'Preservado',
    dot: '#4a7c2e',
    border: '#AFB11C',
    accent: '#AFB11C',
  },
  pressure: {
    color: '#8B3A0F',
    fillColor: '#c0541a',
    fillOpacity: 0.5,
    label: 'Sob pressão',
    dot: '#c0541a',
    border: '#ff6b35',
    accent: '#ff6b35',
  },
  urban: {
    color: '#1a4a6b',
    fillColor: '#2e6e9e',
    fillOpacity: 0.5,
    label: 'Área urbana',
    dot: '#2e6e9e',
    border: '#BCCFE0',
    accent: '#6C94B4',
  },
};

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<MangroveArea | null>(null);

  const totalHa = mangroveAreas.reduce((acc, a) => acc + a.hectares, 0);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-8.1, -34.97],
      zoom: 9,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    leafletMapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mangroveAreas.forEach((area) => {
      const cfg = typeConfig[area.type];

      const polygon = L.polygon(area.polygon as L.LatLngExpression[], {
        color: cfg.color,
        weight: 1.5,
        fillColor: cfg.fillColor,
        fillOpacity: cfg.fillOpacity,
      }).addTo(map);

      polygon.bindTooltip(
        `<div style="font-family:'Work Sans',sans-serif;padding:2px 0">
          <strong style="font-size:12px;color:#404925">${area.name}</strong><br/>
          <span style="font-size:11px;color:#888">${area.hectares.toLocaleString('pt-BR')} ha</span>
        </div>`,
        { sticky: true, direction: 'top', className: 'mangue-tooltip' }
      );

      polygon.on('mouseover', () => {
        polygon.setStyle({ fillOpacity: 0.75, weight: 2.5 });
      });
      polygon.on('mouseout', () => {
        polygon.setStyle({ fillOpacity: cfg.fillOpacity, weight: 1.5 });
      });
      polygon.on('click', () => {
        setSelected(area);
        polygon.setStyle({ fillOpacity: 0.8, weight: 3 });
      });

      L.circleMarker(area.center as L.LatLngExpression, {
        radius: 6,
        color: cfg.border,
        weight: 2,
        fillColor: cfg.dot,
        fillOpacity: 1,
      }).addTo(map).on('click', () => setSelected(area));
    });

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  return (
    <section style={{ backgroundColor: '#F8FAF0' }}>
      <WaveDivider topColor="#F1F4E0" bottomColor="#F8FAF0" />

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
              textTransform: 'uppercase',
            }}
          >
            🗺️ MAPA INTERATIVO
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
            Áreas de manguezal em Pernambuco
          </h2>

          <p
            className="mx-auto"
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontSize: '15px',
              color: '#A9B1B6',
              maxWidth: '580px',
              lineHeight: '1.7',
            }}
          >
            Clique em cada setor para ver informações sobre o manguezal. São{' '}
            <strong style={{ color: '#404925' }}>
              {totalHa.toLocaleString('pt-BR')} hectares
            </strong>{' '}
            de área mapeada ao longo do litoral pernambucano.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div
            className="flex-1 w-full"
            style={{
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(64, 73, 37, 0.12)',
              border: '1px solid rgba(64,73,37,0.08)',
            }}
          >
            <div ref={mapRef} style={{ height: '540px', width: '100%' }} />
          </div>

          <div
            style={{
              width: '300px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                backgroundColor: selected ? '#404925' : 'rgba(64,73,37,0.04)',
                borderRadius: '18px',
                padding: '20px',
                border: selected ? 'none' : '1px dashed rgba(64,73,37,0.18)',
                minHeight: '190px',
                transition: 'all 0.3s ease',
              }}
            >
              {selected ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: 'Work Sans, sans-serif',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '1.2px',
                        color: typeConfig[selected.type].accent,
                        textTransform: 'uppercase',
                      }}
                    >
                      {typeConfig[selected.type].label}
                    </span>
                    <button
                      onClick={() => setSelected(null)}
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        color: 'white',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Lora, serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      color: 'white',
                      marginBottom: '6px',
                    }}
                  >
                    {selected.name}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'Work Sans, sans-serif',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: typeConfig[selected.type].accent,
                      marginBottom: '8px',
                    }}
                  >
                    {selected.hectares.toLocaleString('pt-BR')} ha
                  </div>
                  <p
                    style={{
                      fontFamily: 'Work Sans, sans-serif',
                      fontSize: '13px',
                      lineHeight: '1.65',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {selected.description}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
                  <span style={{ fontSize: '28px' }}>🌿</span>
                  <p
                    style={{
                      fontFamily: 'Work Sans, sans-serif',
                      fontSize: '13px',
                      color: '#A9B1B6',
                      textAlign: 'center',
                      lineHeight: '1.6',
                    }}
                  >
                    Clique em um setor no mapa para ver os detalhes da área
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: '#F1F4E0',
                borderRadius: '18px',
                padding: '18px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  color: '#A9B1B6',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                RESUMO GERAL
              </p>
              {[
                { label: 'Setores mapeados', value: `${mangroveAreas.length}`, unit: 'áreas' },
                {
                  label: 'Total preservado',
                  value: mangroveAreas.filter(a => a.type === 'preserved').reduce((s, a) => s + a.hectares, 0).toLocaleString('pt-BR'),
                  unit: 'ha',
                },
                {
                  label: 'Sob pressão',
                  value: mangroveAreas.filter(a => a.type === 'pressure').reduce((s, a) => s + a.hectares, 0).toLocaleString('pt-BR'),
                  unit: 'ha',
                },
                {
                  label: 'Área urbana',
                  value: mangroveAreas.filter(a => a.type === 'urban').reduce((s, a) => s + a.hectares, 0).toLocaleString('pt-BR'),
                  unit: 'ha',
                },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontFamily: 'Work Sans, sans-serif',
                      fontSize: '13px',
                      color: '#404925',
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Work Sans, sans-serif',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#404925',
                    }}
                  >
                    {stat.value} {stat.unit}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: '#F1F4E0',
                borderRadius: '18px',
                padding: '18px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  color: '#A9B1B6',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                LEGENDA
              </p>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2 mb-2">
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '4px',
                      backgroundColor: cfg.fillColor,
                      border: `2px solid ${cfg.border}`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Work Sans, sans-serif',
                      fontSize: '13px',
                      color: '#404925',
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
