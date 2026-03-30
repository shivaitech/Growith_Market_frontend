import { useEffect } from 'react';

const Toast = ({ isOpen, onClose, message, type = 'success', duration = 3000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { onClose(); }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      bg: 'linear-gradient(135deg, #0f4c2a 0%, #0d3320 100%)',
      border: 'rgba(34,197,94,0.4)',
      iconColor: '#22c55e',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
          <path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    error: {
      bg: 'linear-gradient(135deg, #4c0f1a 0%, #330d14 100%)',
      border: 'rgba(255,77,109,0.4)',
      iconColor: '#FF4D6D',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#FF4D6D" strokeWidth="2"/>
          <path d="M12 8v4m0 4h.01" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    info: {
      bg: 'linear-gradient(135deg, #1a0d4a 0%, #0d0820 100%)',
      border: 'rgba(157,111,255,0.4)',
      iconColor: '#9D6FFF',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#9D6FFF" strokeWidth="2"/>
          <path d="M12 8v4m0 4h.01" stroke="#9D6FFF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  };
  const cfg = typeConfig[type] || typeConfig.info;

  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 18px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '14px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        minWidth: '280px', maxWidth: '380px',
        animation: 'toastSlideIn 0.3s ease',
      }}>
        <div style={{ flexShrink: 0 }}>{cfg.icon}</div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', flex: 1, lineHeight: '1.4' }}>
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px',
            width: '26px', height: '26px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            flexShrink: 0, transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;