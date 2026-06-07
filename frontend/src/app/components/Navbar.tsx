import React from 'react';
import logoEscuro from '../../assets/logo-dark.jpeg';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onDashboardClick?: () => void;
  loggedIn?: boolean;
}

export function Navbar({
  onLoginClick,
  onSignupClick,
  onDashboardClick,
  loggedIn = false,
}: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-20"
      style={{
        backgroundColor: 'rgba(248, 250, 240, 0.93)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(64, 73, 37, 0.08)',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoEscuro}
            alt="+Mangue"
            style={{
              height: '58px',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          {loggedIn ? (
            <button
              onClick={onDashboardClick}
              className="px-6 py-2.5 transition-all hover:opacity-90"
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                backgroundColor: '#404925',
                color: '#F1F4E0',
                borderRadius: '60px',
              }}
            >
              Meu Painel →
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="px-6 py-2.5 border-2 transition-all hover:bg-[#404925] hover:text-[#F1F4E0]"
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderColor: '#404925',
                  color: '#404925',
                  borderRadius: '60px',
                }}
              >
                Entrar
              </button>
              <button
                onClick={onSignupClick}
                className="px-6 py-2.5 transition-all hover:opacity-90"
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  backgroundColor: '#404925',
                  color: '#F1F4E0',
                  borderRadius: '60px',
                }}
              >
                Cadastrar
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
