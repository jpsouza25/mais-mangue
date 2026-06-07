import React from 'react';
import { X } from 'lucide-react';
import { palette, font } from '../../lib/theme';

interface ModalProps {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export function Modal({ title, icon, onClose, children, width = 460 }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative mg-card-in"
        style={{
          width: `${width}px`,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          backgroundColor: '#F8FAF0',
          borderRadius: '22px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '28px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center transition-colors hover:brightness-95"
          style={{ backgroundColor: '#F1F4E0', borderRadius: '50%', border: 'none', cursor: 'pointer', color: palette.dark }}
        >
          <X size={18} />
        </button>

        <h3
          className="flex items-center gap-2 mb-5"
          style={{ fontFamily: font.serif, fontWeight: 700, fontSize: '20px', color: palette.dark }}
        >
          {icon}
          {title}
        </h3>

        {children}
      </div>
    </div>
  );
}
