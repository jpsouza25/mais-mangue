import { useNavigate } from 'react-router';
import { Loader2, Users, ArrowRight, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useRequireAuth } from '../hooks/useAuth';
import { palette, font } from '../lib/theme';

const impactStats = [
  { icon: '🌱', value: '12', label: 'Denúncias enviadas', bg: 'rgba(175,177,28,0.14)' },
  { icon: '♻️', value: '340', label: 'Créditos Verdes', bg: 'rgba(108,148,180,0.14)' },
  { icon: '☁️', value: '1,8 t', label: 'CO₂ compensado', bg: 'rgba(164,170,127,0.18)' },
  { icon: '🤝', value: '5', label: 'Mutirões', bg: 'rgba(116,75,38,0.12)' },
];

const quickActions = [
  { icon: '📸', title: 'Nova denúncia', desc: 'Registre um problema ambiental com foto e GPS.' },
  { icon: '🗺️', title: 'Mapa de manguezais', desc: 'Veja as áreas mapeadas no litoral de Pernambuco.' },
  { icon: '🌿', title: 'Mutirões', desc: 'Participe de ações de plantio e limpeza.' },
  { icon: '⭐', title: 'Meus Créditos Verdes', desc: 'Acompanhe sua pontuação e recompensas.' },
];

export function Dashboard() {
  const { loading, user } = useRequireAuth();
  const navigate = useNavigate();

  if (loading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.offWhite }}
      >
        <Loader2 size={32} className="mg-spin" style={{ color: palette.dark }} />
      </div>
    );
  }

  const firstName = (user.nome_completo || user.usuario).split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: palette.offWhite, fontFamily: font.sans }}>
      <DashboardHeader user={user} />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <section
          className="mg-card-in relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${palette.dark} 0%, ${palette.darkAlt} 100%)`,
            borderRadius: '24px',
            padding: '34px 36px',
            boxShadow: '0 12px 40px rgba(64,73,37,0.18)',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              fontSize: '180px',
              opacity: 0.08,
              lineHeight: 1,
            }}
          >
            🌿
          </div>
          <div
            className="inline-block mb-3"
            style={{
              background: 'rgba(175,177,28,0.22)',
              color: palette.lime,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              padding: '6px 14px',
            }}
          >
            Painel do cidadão
          </div>
          <h1 style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '34px', color: '#fff', lineHeight: 1.2 }}>
            Olá, {firstName} 👋
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.82)', marginTop: '8px', maxWidth: '560px', lineHeight: 1.6 }}>
            Bem-vindo(a) ao seu painel +Mangue. Acompanhe seu impacto na preservação dos
            manguezais urbanos do Recife e participe das ações da comunidade.
          </p>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {impactStats.map((s, i) => (
            <div
              key={s.label}
              className="mg-card-in"
              style={{
                animationDelay: `${0.05 * (i + 1)}s`,
                backgroundColor: '#fff',
                borderRadius: '18px',
                padding: '20px',
                border: '1px solid rgba(64,73,37,0.08)',
                boxShadow: '0 2px 10px rgba(64,73,37,0.04)',
              }}
            >
              <div
                className="flex items-center justify-center mb-3"
                style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: s.bg, fontSize: '22px' }}
              >
                {s.icon}
              </div>
              <div style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '26px', color: palette.dark, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '13px', color: palette.silver, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '22px', color: palette.dark, marginBottom: '4px' }}>
            Ações rápidas
          </h2>
          <p style={{ fontSize: '14px', color: palette.silver, marginBottom: '18px' }}>
            Atalhos para as principais funcionalidades do +Mangue.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a) => (
              <button
                key={a.title}
                onClick={() => toast('Funcionalidade em breve 🌱', { description: a.title })}
                className="text-left transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '18px',
                  padding: '20px',
                  border: '1px solid rgba(64,73,37,0.08)',
                  boxShadow: '0 2px 10px rgba(64,73,37,0.04)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{a.icon}</div>
                <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: '15px', color: palette.dark, marginBottom: '4px' }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '13px', color: palette.silver, lineHeight: 1.5 }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Code2 size={16} style={{ color: palette.brown }} />
            <span
              style={{
                fontFamily: font.sans,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: palette.brown,
              }}
            >
              Área do desenvolvedor
            </span>
          </div>

          <button
            onClick={() => navigate('/dashboard/usuarios')}
            className="w-full text-left transition-all hover:-translate-y-1 group"
            style={{
              background: 'linear-gradient(135deg, #2e4a50 0%, #1c3a4a 100%)',
              borderRadius: '22px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 36px rgba(28,58,74,0.25)',
              cursor: 'pointer',
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: '58px', height: '58px', borderRadius: '16px', background: 'rgba(108,148,180,0.25)', color: palette.blueLight }}
              >
                <Users size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '20px', color: '#fff' }}>
                    Gerenciar Usuários
                  </h3>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: palette.dark,
                      background: palette.lime,
                      borderRadius: '6px',
                      padding: '2px 7px',
                    }}
                  >
                    DEV
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55 }}>
                  CRUD completo de usuários cadastrados — listar, buscar, editar, redefinir
                  senha e excluir. Conectado ao backend Flask + SQLite.
                </p>
              </div>
              <ArrowRight
                size={24}
                className="shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: palette.blueLight }}
              />
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
