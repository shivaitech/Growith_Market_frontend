import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', buttons = [] }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const typeStyles = {
    success: { icon: '#22c55e', accent: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)' },
    error:   { icon: '#FF4D6D', accent: 'rgba(255,77,109,0.12)', border: 'rgba(255,77,109,0.3)' },
    info:    { icon: '#9D6FFF', accent: 'rgba(157,111,255,0.12)', border: 'rgba(157,111,255,0.3)' },
  };
  const s = typeStyles[type] || typeStyles.info;

  const icons = {
    success: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={s.icon} strokeWidth="2"/>
        <path d="M7 13l3 3 7-7" stroke={s.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={s.icon} strokeWidth="2"/>
        <path d="M12 8v4m0 4h.01" stroke={s.icon} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    info: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={s.icon} strokeWidth="2"/>
        <path d="M12 8v4m0 4h.01" stroke={s.icon} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,6,30,0.75)', backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'linear-gradient(145deg, #1a0d4a 0%, #0d0820 100%)',
        border: `1px solid ${s.border}`,
        borderRadius: '20px',
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
        maxWidth: '420px', width: '90%', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: s.accent, border: `1px solid ${s.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {icons[type]}
            </div>
            <h3 style={{
              margin: 0, fontSize: '16px', fontWeight: 700,
              color: '#ffffff', letterSpacing: '-0.2px',
            }}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              borderRadius: '8px', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{
            margin: 0, fontSize: '14px', lineHeight: '1.6',
            color: 'rgba(255,255,255,0.7)',
          }}>{message}</p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          padding: '16px 24px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {buttons.map((button, index) => (
            <button key={index} onClick={button.onClick} style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              border: button.variant === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              background: button.variant === 'primary'
                ? 'linear-gradient(135deg, #6B35FF 0%, #9D6FFF 100%)'
                : 'rgba(255,255,255,0.08)',
              color: '#ffffff',
            }}>
              {button.text}
            </button>
          ))}
          <button onClick={onClose} style={{
            padding: '10px 24px', borderRadius: '10px', fontSize: '14px',
            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
            background: 'linear-gradient(135deg, #6B35FF 0%, #9D6FFF 100%)',
            border: 'none', color: '#ffffff',
            boxShadow: '0 4px 14px rgba(107,53,255,0.35)',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;