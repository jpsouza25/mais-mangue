import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '../lib/api';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSuccess: () => void;
}

export function LoginModal({ onClose, onSwitchToSignup, onSuccess }: LoginModalProps) {
  const [userType, setUserType] = useState<'population' | 'company'>('population');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !senha) {
      setError('Preencha usuário e senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(usuario.trim(), senha);
      if (res.success) {
        toast.success('Login realizado! Redirecionando…');
        onSuccess();
      } else {
        setError(res.message || 'Não foi possível entrar.');
      }
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative mg-card-in"
        style={{
          width: '420px',
          maxWidth: 'calc(100vw - 32px)',
          backgroundColor: '#F8FAF0',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center transition-colors hover:brightness-95"
          style={{
            backgroundColor: '#F1F4E0',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            color: '#404925',
          }}
        >
          <X size={18} />
        </button>

        <h2
          className="mb-2"
          style={{ fontFamily: 'Lora, serif', fontWeight: 700, fontSize: '24px', color: '#404925' }}
        >
          Entrar
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '13px', color: '#A9B1B6' }}
        >
          Acesse o seu painel +Mangue
        </p>

        <div className="flex gap-3 mb-6">
          {(
            [
              ['population', '🌿 População'],
              ['company', '🏢 Empresa'],
            ] as const
          ).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className="flex-1 py-2.5 px-4 transition-all"
              style={{
                fontFamily: 'Work Sans, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                backgroundColor: userType === type ? '#F1F4E0' : 'transparent',
                color: '#404925',
                border:
                  userType === type
                    ? '2px solid #404925'
                    : '2px solid rgba(64, 73, 37, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="login-usuario"
              className="block mb-2"
              style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#404925' }}
            >
              Usuário ou e-mail
            </label>
            <input
              id="login-usuario"
              type="text"
              className="mg-input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="seu_usuario ou seu@email.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="login-senha"
              className="block mb-2"
              style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#404925' }}
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="login-senha"
                type={showPwd ? 'text' : 'password'}
                className="mg-input"
                style={{ paddingRight: '44px' }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute top-1/2 -translate-y-1/2 right-3"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A9B1B6' }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="mb-2"
              style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '12.5px', color: '#b3261e', marginTop: '6px' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: '#404925',
              color: '#F1F4E0',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading && <Loader2 size={16} className="mg-spin" />}
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p
          className="mt-4 text-center"
          style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '13px', color: '#A9B1B6' }}
        >
          Não tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="transition-colors hover:underline"
            style={{
              fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: '#6C94B4',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Cadastrar
          </button>
        </p>
      </div>
    </div>
  );
}
