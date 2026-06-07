import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  Search,
  RefreshCw,
  Pencil,
  KeyRound,
  Trash2,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Save,
  AlertTriangle,
  Users as UsersIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Modal } from '../components/dashboard/Modal';
import { useRequireAuth } from '../hooks/useAuth';
import {
  listUsers,
  updateUser,
  deleteUser,
  updatePassword,
  type User,
} from '../lib/api';
import { palette, font } from '../lib/theme';

const PAGE_SIZE = 8;

type SortKey = keyof Omit<User, never>;

function fmtDate(d: string): string {
  if (!d) return '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, dd] = d.split('-');
    return `${dd}/${m}/${y}`;
  }
  return d;
}
function toInputDate(d: string): string {
  if (!d) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const [dd, m, y] = d.split('/');
  return `${y}-${m}-${dd}`;
}

const genderStyles: Record<string, { bg: string; color: string }> = {
  Masculino: { bg: 'rgba(108,148,180,0.16)', color: '#3d6b8c' },
  Feminino: { bg: 'rgba(116,75,38,0.14)', color: '#744B26' },
  Outro: { bg: 'rgba(175,177,28,0.18)', color: '#6f7012' },
};
function GenderBadge({ g }: { g: string }) {
  const s = genderStyles[g] ?? genderStyles.Outro;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 11px',
        borderRadius: '40px',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: font.sans,
        backgroundColor: s.bg,
        color: s.color,
      }}
    >
      {g || '—'}
    </span>
  );
}

const inputLabel: React.CSSProperties = {
  fontFamily: font.sans,
  fontSize: '13px',
  fontWeight: 600,
  color: palette.dark,
  display: 'block',
  marginBottom: '6px',
};

export function UserManagement() {
  const { loading: authLoading, user: me } = useRequireAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Omit<User, 'id'>>({
    usuario: '',
    nome_completo: '',
    email: '',
    data_nascimento: '',
    genero: '',
  });
  const [saving, setSaving] = useState(false);

  const [pwdUser, setPwdUser] = useState<User | null>(null);
  const [pwd, setPwd] = useState({ nova: '', confirma: '' });

  const [delUser, setDelUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && me) load();
  }, [authLoading, me]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const base = q
      ? users.filter(
          (u) =>
            u.usuario.toLowerCase().includes(q) ||
            u.nome_completo.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.genero || '').toLowerCase().includes(q),
        )
      : users;
    const sorted = [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp: number;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).toLowerCase().localeCompare(String(bv).toLowerCase());
      return sortAsc ? cmp : -cmp;
    });
    return sorted;
  }, [users, query, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => {
    const m = users.filter((u) => u.genero === 'Masculino').length;
    const f = users.filter((u) => u.genero === 'Feminino').length;
    return { total: users.length, m, f, o: users.length - m - f };
  }, [users]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  }

  function openEdit(u: User) {
    setEditUser(u);
    setEditForm({
      usuario: u.usuario,
      nome_completo: u.nome_completo,
      email: u.email,
      data_nascimento: toInputDate(u.data_nascimento),
      genero: u.genero,
    });
  }
  async function saveEdit() {
    if (!editUser) return;
    if (Object.values(editForm).some((v) => !String(v).trim())) {
      toast.error('Preencha todos os campos');
      return;
    }
    setSaving(true);
    try {
      const res = await updateUser(editUser.id, editForm);
      if (res.success) {
        toast.success('Usuário atualizado');
        setEditUser(null);
        await load();
      } else {
        toast.error(res.message || 'Erro ao atualizar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  }

  function openPwd(u: User) {
    setPwdUser(u);
    setPwd({ nova: '', confirma: '' });
  }
  async function savePwd() {
    if (!pwdUser) return;
    if (!pwd.nova) {
      toast.error('Digite a nova senha');
      return;
    }
    if (pwd.nova !== pwd.confirma) {
      toast.error('As senhas não coincidem');
      return;
    }
    setSaving(true);
    try {
      const res = await updatePassword(pwdUser.id, pwd.nova);
      if (res.success) {
        toast.success('Senha redefinida');
        setPwdUser(null);
      } else {
        toast.error(res.message || 'Erro ao redefinir senha');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!delUser) return;
    setDeleting(true);
    try {
      const res = await deleteUser(delUser.id);
      if (res.success) {
        toast.success('Usuário excluído');
        setDelUser(null);
        await load();
      } else {
        toast.error(res.message || 'Erro ao excluir');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setDeleting(false);
    }
  }

  if (authLoading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: palette.offWhite }}>
        <Loader2 size={32} className="mg-spin" style={{ color: palette.dark }} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total de usuários', value: stats.total, icon: '👥', bg: 'rgba(64,73,37,0.1)' },
    { label: 'Masculino', value: stats.m, icon: '🔵', bg: 'rgba(108,148,180,0.16)' },
    { label: 'Feminino', value: stats.f, icon: '🟤', bg: 'rgba(116,75,38,0.14)' },
    { label: 'Outro', value: stats.o, icon: '🟢', bg: 'rgba(175,177,28,0.18)' },
  ];

  const headers: { key: SortKey; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'usuario', label: 'Usuário' },
    { key: 'nome_completo', label: 'Nome completo' },
    { key: 'email', label: 'E-mail' },
    { key: 'data_nascimento', label: 'Nascimento' },
    { key: 'genero', label: 'Gênero' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: palette.offWhite, fontFamily: font.sans }}>
      <DashboardHeader user={me} back={{ to: '/dashboard', label: 'Voltar ao painel' }} />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-1">
          <UsersIcon size={26} style={{ color: palette.dark }} />
          <h1 style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '30px', color: palette.dark }}>
            Gerenciar Usuários
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: palette.silver, marginBottom: '24px' }}>
          Painel de desenvolvedor — CRUD de usuários conectado ao backend Flask + SQLite.
        </p>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className="mg-card-in flex items-center gap-4"
              style={{
                animationDelay: `${0.05 * (i + 1)}s`,
                backgroundColor: '#fff',
                borderRadius: '18px',
                padding: '18px 20px',
                border: '1px solid rgba(64,73,37,0.08)',
                boxShadow: '0 2px 10px rgba(64,73,37,0.04)',
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: s.bg, fontSize: '20px' }}
              >
                {s.icon}
              </div>
              <div>
                <div style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '26px', color: palette.dark, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '12.5px', color: palette.silver, marginTop: '3px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </section>

        <section
          className="mg-card-in"
          style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            border: '1px solid rgba(64,73,37,0.08)',
            boxShadow: '0 4px 18px rgba(64,73,37,0.05)',
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{ padding: '18px 22px', borderBottom: '1px solid rgba(64,73,37,0.08)' }}
          >
            <span style={{ fontFamily: font.sans, fontWeight: 600, fontSize: '15px', color: palette.dark }}>
              Todos os usuários
            </span>
            <div className="ms-auto flex items-center gap-2 flex-wrap" style={{ marginLeft: 'auto' }}>
              <div className="relative">
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: palette.silver }}
                />
                <input
                  className="mg-input"
                  style={{ width: '240px', paddingLeft: '36px', paddingTop: '9px', paddingBottom: '9px' }}
                  placeholder="Buscar usuário, nome, e-mail…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <button
                onClick={load}
                aria-label="Atualizar"
                title="Atualizar"
                className="flex items-center justify-center transition-colors hover:brightness-95"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(64,73,37,0.07)',
                  border: 'none',
                  color: palette.dark,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} className={loading ? 'mg-spin' : ''} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center" style={{ padding: '64px' }}>
              <Loader2 size={28} className="mg-spin" style={{ color: palette.dark }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ padding: '64px 24px', textAlign: 'center' }}>
              <Inbox size={42} style={{ color: palette.silver, opacity: 0.5 }} />
              <p style={{ color: palette.silver, marginTop: '12px', fontSize: '14px' }}>
                {query ? 'Nenhum usuário corresponde à busca.' : 'Nenhum usuário cadastrado ainda.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h.key}
                        onClick={() => handleSort(h.key)}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontFamily: font.sans,
                          fontSize: '11.5px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: sortKey === h.key ? palette.dark : palette.silver,
                          background: 'rgba(64,73,37,0.03)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          userSelect: 'none',
                        }}
                      >
                        <span className="inline-flex items-center gap-1">
                          {h.label}
                          <ChevronsUpDown size={12} style={{ opacity: sortKey === h.key ? 0.9 : 0.4 }} />
                        </span>
                      </th>
                    ))}
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        fontFamily: font.sans,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: palette.silver,
                        background: 'rgba(64,73,37,0.03)',
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((u) => {
                    const isMe = u.id === me.id;
                    return (
                      <tr key={u.id} style={{ borderTop: '1px solid rgba(64,73,37,0.07)' }}>
                        <td style={{ padding: '13px 16px', fontSize: '13px', color: palette.silver }}>#{u.id}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span
                            style={{
                              fontFamily: font.sans,
                              fontSize: '13px',
                              fontWeight: 600,
                              color: palette.dark,
                              background: 'rgba(108,148,180,0.14)',
                              borderRadius: '7px',
                              padding: '3px 9px',
                            }}
                          >
                            @{u.usuario}
                          </span>
                          {isMe && (
                            <span
                              style={{
                                marginLeft: '8px',
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                color: palette.lime,
                                background: 'rgba(175,177,28,0.18)',
                                borderRadius: '6px',
                                padding: '2px 6px',
                              }}
                            >
                              VOCÊ
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: '14px', color: palette.text }}>{u.nome_completo}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13.5px', color: palette.silver }}>{u.email}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13.5px', color: palette.silver }}>
                          {fmtDate(u.data_nascimento)}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <GenderBadge g={u.genero} />
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <ActionButton title="Editar" onClick={() => openEdit(u)} color="#3d6b8c" bg="rgba(108,148,180,0.16)">
                            <Pencil size={15} />
                          </ActionButton>
                          <ActionButton title="Redefinir senha" onClick={() => openPwd(u)} color="#6f7012" bg="rgba(175,177,28,0.18)">
                            <KeyRound size={15} />
                          </ActionButton>
                          <ActionButton
                            title={isMe ? 'Não é possível excluir a si mesmo' : 'Excluir'}
                            onClick={() => !isMe && setDelUser(u)}
                            color="#b3261e"
                            bg="rgba(179,38,30,0.12)"
                            disabled={isMe}
                          >
                            <Trash2 size={15} />
                          </ActionButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div
              className="flex items-center justify-between flex-wrap gap-2"
              style={{ padding: '14px 22px', borderTop: '1px solid rgba(64,73,37,0.08)' }}
            >
              <span style={{ fontSize: '13px', color: palette.silver }}>
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} de{' '}
                {filtered.length} usuário{filtered.length !== 1 ? 's' : ''}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <PageBtn disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                    <ChevronLeft size={16} />
                  </PageBtn>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PageBtn key={p} active={p === currentPage} onClick={() => setPage(p)}>
                      {p}
                    </PageBtn>
                  ))}
                  <PageBtn disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                    <ChevronRight size={16} />
                  </PageBtn>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {editUser && (
        <Modal title="Editar usuário" icon={<Pencil size={18} style={{ color: palette.blue }} />} onClose={() => setEditUser(null)}>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label style={inputLabel}>Usuário</label>
              <input
                className="mg-input"
                value={editForm.usuario}
                onChange={(e) => setEditForm({ ...editForm, usuario: e.target.value })}
              />
            </div>
            <div style={{ width: '150px' }}>
              <label style={inputLabel}>Gênero</label>
              <select
                className="mg-select"
                value={editForm.genero}
                onChange={(e) => setEditForm({ ...editForm, genero: e.target.value })}
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label style={inputLabel}>Nome completo</label>
            <input
              className="mg-input"
              value={editForm.nome_completo}
              onChange={(e) => setEditForm({ ...editForm, nome_completo: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label style={inputLabel}>E-mail</label>
            <input
              type="email"
              className="mg-input"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>
          <div className="mb-5">
            <label style={inputLabel}>Data de nascimento</label>
            <input
              type="date"
              className="mg-input"
              value={editForm.data_nascimento}
              onChange={(e) => setEditForm({ ...editForm, data_nascimento: e.target.value })}
            />
          </div>
          <ModalFooter onCancel={() => setEditUser(null)} onConfirm={saveEdit} loading={saving} confirmLabel="Salvar" confirmIcon={<Save size={15} />} />
        </Modal>
      )}

      {pwdUser && (
        <Modal
          title="Redefinir senha"
          icon={<KeyRound size={18} style={{ color: '#6f7012' }} />}
          onClose={() => setPwdUser(null)}
          width={420}
        >
          <p style={{ fontSize: '13.5px', color: palette.silver, marginBottom: '18px' }}>
            Definindo nova senha para{' '}
            <strong style={{ color: palette.dark }}>@{pwdUser.usuario}</strong>.
          </p>
          <div className="mb-4">
            <label style={inputLabel}>Nova senha</label>
            <input
              type="password"
              className="mg-input"
              placeholder="Nova senha"
              value={pwd.nova}
              onChange={(e) => setPwd({ ...pwd, nova: e.target.value })}
            />
          </div>
          <div className="mb-5">
            <label style={inputLabel}>Confirmar senha</label>
            <input
              type="password"
              className="mg-input"
              placeholder="Repita a senha"
              value={pwd.confirma}
              onChange={(e) => setPwd({ ...pwd, confirma: e.target.value })}
            />
          </div>
          <ModalFooter onCancel={() => setPwdUser(null)} onConfirm={savePwd} loading={saving} confirmLabel="Redefinir" confirmIcon={<KeyRound size={15} />} />
        </Modal>
      )}

      {delUser && (
        <Modal title="Excluir usuário" icon={<AlertTriangle size={18} style={{ color: '#b3261e' }} />} onClose={() => setDelUser(null)} width={420}>
          <div
            className="flex items-center justify-center mx-auto mb-4"
            style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(179,38,30,0.12)', color: '#b3261e' }}
          >
            <Trash2 size={26} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '14px', color: palette.text, lineHeight: 1.6, marginBottom: '4px' }}>
            Tem certeza que deseja excluir{' '}
            <strong style={{ color: palette.dark }}>@{delUser.usuario}</strong>?
          </p>
          <p style={{ textAlign: 'center', fontSize: '13px', color: palette.silver, marginBottom: '20px' }}>
            Esta ação é permanente e não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDelUser(null)}
              className="flex-1 transition-colors hover:brightness-95"
              style={{
                fontFamily: font.sans,
                fontWeight: 600,
                fontSize: '14px',
                color: palette.dark,
                background: 'rgba(64,73,37,0.07)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                fontFamily: font.sans,
                fontWeight: 600,
                fontSize: '14px',
                color: '#fff',
                background: '#b3261e',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.8 : 1,
              }}
            >
              {deleting && <Loader2 size={15} className="mg-spin" />}
              {deleting ? 'Excluindo…' : 'Excluir'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  color,
  bg,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  color: string;
  bg: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="transition-all hover:brightness-95"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '9px',
        border: 'none',
        background: disabled ? 'rgba(64,73,37,0.05)' : bg,
        color: disabled ? palette.silver : color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        marginLeft: '6px',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function PageBtn({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="transition-all hover:brightness-95"
      style={{
        minWidth: '32px',
        height: '32px',
        padding: '0 8px',
        borderRadius: '9px',
        border: '1px solid rgba(64,73,37,0.12)',
        background: active ? palette.dark : 'transparent',
        color: active ? '#F1F4E0' : palette.dark,
        fontFamily: font.sans,
        fontSize: '13px',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

function ModalFooter({
  onCancel,
  onConfirm,
  loading,
  confirmLabel,
  confirmIcon,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  confirmLabel: string;
  confirmIcon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 justify-end">
      <button
        onClick={onCancel}
        className="transition-colors hover:brightness-95"
        style={{
          fontFamily: font.sans,
          fontWeight: 600,
          fontSize: '14px',
          color: palette.dark,
          background: 'rgba(64,73,37,0.07)',
          border: 'none',
          borderRadius: '12px',
          padding: '11px 20px',
          cursor: 'pointer',
        }}
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="flex items-center gap-2 transition-all hover:opacity-90"
        style={{
          fontFamily: font.sans,
          fontWeight: 600,
          fontSize: '14px',
          color: '#F1F4E0',
          background: palette.dark,
          border: 'none',
          borderRadius: '12px',
          padding: '11px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? <Loader2 size={15} className="mg-spin" /> : confirmIcon}
        {confirmLabel}
      </button>
    </div>
  );
}
