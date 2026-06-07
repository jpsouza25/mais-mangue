import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { register } from '../lib/api';

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Work Sans, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  color: '#404925',
  display: 'block',
  marginBottom: '6px',
};

export function SignupModal({ onClose, onSwitchToLogin, onSuccess }: SignupModalProps) {
  const [userType, setUserType] = useState<'population' | 'company'>('population');
  const [form, setForm] = useState({
    usuario: '',
    genero: '',
    nome_completo: '',
    email: '',
    data_nascimento: '',
    senha: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = {
      ...form,
      usuario: form.usuario.trim(),
      nome_completo: form.nome_completo.trim(),
      email: form.email.trim(),
    };
    if (Object.values(trimmed).some((v) => !v)) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await register(trimmed);
      if (res.success) {
        toast.success('Conta criada com sucesso! Bem-vindo(a) ao +Mangue 🌿');
        onSuccess();
      } else {
        setError(res.message || 'Não foi possível concluir o cadastro.');
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
          width: '440px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
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
          Criar Conta
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '13px', color: '#A9B1B6' }}
        >
          Junte-se à preservação dos manguezais
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
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label htmlFor="su-usuario" style={labelStyle}>Usuário</label>
              <input
                id="su-usuario"
                type="text"
                className="mg-input"
                value={form.usuario}
                onChange={set('usuario')}
                placeholder="usuario"
                autoComplete="username"
                required
              />
            </div>
            <div style={{ width: '140px' }}>
              <label htmlFor="su-genero" style={labelStyle}>Gênero</label>
              <select
                id="su-genero"
                className="mg-select"
                value={form.genero}
                onChange={set('genero')}
                required
                style={{ color: form.genero ? '#404925' : '#A9B1B6' }}
              >
                <option value="" disabled>—</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="su-nome" style={labelStyle}>Nome completo</label>
            <input
              id="su-nome"
              type="text"
              className="mg-input"
              value={form.nome_completo}
              onChange={set('nome_completo')}
              placeholder="Seu nome completo"
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="su-email" style={labelStyle}>E-mail</label>
            <input
              id="su-email"
              type="email"
              className="mg-input"
              value={form.email}
              onChange={set('email')}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="su-data" style={labelStyle}>Data de nascimento</label>
            <input
              id="su-data"
              type="date"
              className="mg-input"
              value={form.data_nascimento}
              onChange={set('data_nascimento')}
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="su-senha" style={labelStyle}>Senha</label>
            <div className="relative">
              <input
                id="su-senha"
                type={showPwd ? 'text' : 'password'}
                className="mg-input"
                style={{ paddingRight: '44px' }}
                value={form.senha}
                onChange={set('senha')}
                placeholder="Sua senha"
                autoComplete="new-password"
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
            <p style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '12.5px', color: '#b3261e', marginTop: '6px' }}>
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
            {loading ? 'Criando…' : 'Cadastrar'}
          </button>
        </form>

        <p
          className="mt-4 text-center"
          style={{ fontFamily: 'Work Sans, sans-serif', fontSize: '13px', color: '#A9B1B6' }}
        >
          Já tem conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
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
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
