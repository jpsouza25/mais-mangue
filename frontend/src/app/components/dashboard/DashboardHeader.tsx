import { useNavigate, Link } from 'react-router';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import logoEscuro from '../../../assets/logo-dark.jpeg';
import { logout, type User } from '../../lib/api';
import { palette, font } from '../../lib/theme';

interface DashboardHeaderProps {
  user: User | null;
  back?: { to: string; label: string };
}

export function DashboardHeader({ user, back }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const initial = (user?.nome_completo || user?.usuario || '?').charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      toast.success('Sessão encerrada');
      navigate('/', { replace: true });
    }
  };

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        height: '72px',
        backgroundColor: 'rgba(248, 250, 240, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(64, 73, 37, 0.1)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/dashboard" className="flex items-center shrink-0">
            <img
              src={logoEscuro}
              alt="+Mangue"
              style={{ height: '46px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
            />
          </Link>
          {back && (
            <button
              onClick={() => navigate(back.to)}
              className="flex items-center gap-1.5 transition-colors hover:opacity-80"
              style={{
                fontFamily: font.sans,
                fontSize: '13px',
                fontWeight: 600,
                color: palette.dark,
                background: 'rgba(64,73,37,0.07)',
                border: 'none',
                borderRadius: '40px',
                padding: '7px 14px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={15} /> {back.label}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2.5 pr-1.5 pl-1.5 py-1.5 rounded-full"
            style={{ background: 'rgba(64,73,37,0.06)' }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${palette.dark}, ${palette.olive})`,
                color: '#fff',
                fontFamily: font.sans,
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              {initial}
            </div>
            <div className="pr-2 leading-tight">
              <div style={{ fontFamily: font.sans, fontSize: '13px', fontWeight: 600, color: palette.dark }}>
                {user?.usuario ?? '—'}
              </div>
              <div style={{ fontFamily: font.sans, fontSize: '11px', color: palette.silver }}>
                {user?.email ?? ''}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 transition-all hover:opacity-90"
            style={{
              fontFamily: font.sans,
              fontSize: '13px',
              fontWeight: 600,
              color: palette.dark,
              background: 'transparent',
              border: `2px solid ${palette.dark}`,
              borderRadius: '40px',
              padding: '7px 16px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}
