import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AGREEMENT_PDF, FIELD_GROUPS, buildPrefill, fixedValue, generateSignedAgreement,
} from '../../utils/agreementPdf';

const SIGNED_FILENAME = 'ShivAI_DOS_Private_Participation_Agreement_signed.pdf';
const border = '1px solid rgba(128,128,128,0.35)';

/* ── E-sign modal: draw a signature or upload an image of one ── */
function ESignModal({ open, onClose, onApply, busy }) {
  const [tab, setTab] = useState('draw');
  const [hasInk, setHasInk] = useState(false);
  const [upload, setUpload] = useState(null);   // { url, file }
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (!open) return;
    setTab('draw'); setHasInk(false); setUpload(null); setError('');
  }, [open]);

  // size the canvas for crisp lines on high-DPI screens
  useEffect(() => {
    if (!open || tab !== 'draw') return;
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0b1240';
  }, [open, tab]);

  if (!open) return null;

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.01, p.y + 0.01);
    ctx.stroke();
    setHasInk(true);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const up = () => { drawing.current = false; };
  const clear = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!/^image\/(png|jpe?g)$/i.test(f.type)) { setError('Please upload a PNG or JPG image of your signature.'); return; }
    if (f.size > 4 * 1024 * 1024) { setError('The image is too large (max 4 MB).'); return; }
    setError('');
    setUpload({ url: URL.createObjectURL(f), file: f });
  };

  const canApply = tab === 'draw' ? hasInk : !!upload;

  const apply = async () => {
    setError('');
    try {
      if (tab === 'draw') {
        const blob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png'));
        onApply({ bytes: new Uint8Array(await blob.arrayBuffer()), kind: 'png' });
      } else {
        const kind = /png/i.test(upload.file.type) ? 'png' : 'jpg';
        onApply({ bytes: new Uint8Array(await upload.file.arrayBuffer()), kind });
      }
    } catch {
      setError('We could not read your signature. Please try again.');
    }
  };

  const tabBtn = (id, label) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`db-btn ${tab === id ? 'db-btn--primary' : 'db-btn--ghost'}`}
      style={{ flex: 1 }}
    >
      {label}
    </button>
  );

  return (
    <div className="db-modal-overlay" style={{ zIndex: 10050 }} onClick={busy ? undefined : onClose}>
      <div className="db-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, width: '94vw' }}>
        <div className="db-modal-header">
          <div>
            <div className="db-modal-header__title">E-sign agreement</div>
            <div className="db-modal-header__sub">Draw your signature or upload an image of it.</div>
          </div>
          <button className="db-modal-close" onClick={onClose} disabled={busy} aria-label="Close">✕</button>
        </div>
        <div className="db-modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {tabBtn('draw', 'Draw')}
            {tabBtn('upload', 'Upload')}
          </div>

          {tab === 'draw' ? (
            <>
              <canvas
                ref={canvasRef}
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={up}
                onPointerLeave={up}
                style={{ width: '100%', height: 190, background: '#fff', border, borderRadius: 10, touchAction: 'none', cursor: 'crosshair', display: 'block' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                <span>Sign inside the box using your mouse, finger or stylus.</span>
                <button type="button" onClick={clear} style={{ background: 'none', border: 'none', color: '#9D6FFF', cursor: 'pointer' }}>Clear</button>
              </div>
            </>
          ) : (
            <label
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                height: 190, border: '1.5px dashed rgba(128,128,128,0.5)', borderRadius: 10, cursor: 'pointer',
                background: upload ? '#fff' : 'transparent', overflow: 'hidden',
              }}
            >
              <input type="file" accept="image/png,image/jpeg" onChange={onFile} style={{ display: 'none' }} />
              {upload
                ? <img src={upload.url} alt="Your signature" style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }} />
                : (<><strong>Click to upload your signature</strong><span style={{ fontSize: 12, opacity: 0.7 }}>PNG or JPG, up to 4 MB. A clear photo on white paper works best.</span></>)}
            </label>
          )}

          {error && <div className="kyc-form__api-error" style={{ marginTop: 12 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="db-btn db-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
            <button type="button" className="db-btn db-btn--primary" onClick={apply} disabled={!canApply || busy}>
              {busy ? 'Generating PDF…' : 'Sign & generate PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Agreement flow: fill → e-sign → preview signed PDF → accept ── */
export default function PurchaseAgreementFlow({ open, investor, onClose, onAccept }) {
  const [step, setStep] = useState('fill');      // 'fill' | 'review'
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [signOpen, setSignOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [genError, setGenError] = useState('');
  const [pdf, setPdf] = useState(null);           // { blob, url }
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const prefill = useMemo(() => buildPrefill(investor), [investor]);

  useEffect(() => {
    if (!open) return;
    setStep('fill'); setValues(prefill); setErrors({}); setSignOpen(false);
    setGenError(''); setChecked(false); setSubmitError(''); setPdf(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => { if (pdf?.url) URL.revokeObjectURL(pdf.url); }, [pdf]);

  if (!open) return null;

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const goSign = () => {
    const errs = {};
    FIELD_GROUPS.forEach((g) => g.fields.forEach((f) => {
      if (f.required && !String(values[f.name] || '').trim()) errs[f.name] = `${f.label} is required`;
    }));
    const email = String(values.participant_email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.participant_email = 'Enter a valid email address';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setGenError('');
    setSignOpen(true);
  };

  const applySignature = async (signature) => {
    setBusy(true);
    setGenError('');
    try {
      const bytes = await generateSignedAgreement({ values, signature, signerName: values.participant_full_name });
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setPdf({ blob, url: URL.createObjectURL(blob) });
      setSignOpen(false);
      setChecked(false);
      setSubmitError('');
      setStep('review');
    } catch (err) {
      setSignOpen(false);
      setGenError(err?.message || 'We could not generate the signed agreement. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const accept = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const file = new File([pdf.blob], SIGNED_FILENAME, { type: 'application/pdf' });
      await onAccept(file, values);
    } catch (err) {
      setSubmitError(err?.message || 'We could not record your acceptance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => { if (!submitting && !busy) onClose(); };

  return (
    <>
      <div className="db-modal-overlay" onClick={close}>
        <div className="db-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860, width: '94vw', maxHeight: '92vh', overflowY: 'auto' }}>
          <div className="db-modal-header">
            <div>
              <div className="db-modal-header__title">Private Participation Agreement</div>
              <div className="db-modal-header__sub">
                {step === 'fill'
                  ? 'Step 1 of 2 — Check your details and fill in any blanks, then e-sign. This is a one-time step.'
                  : 'Step 2 of 2 — Review your signed agreement and accept to continue.'}
              </div>
            </div>
            <button className="db-modal-close" onClick={close} disabled={submitting || busy} aria-label="Close">✕</button>
          </div>

          <div className="db-modal-body">
            {step === 'fill' && (
              <>
                <div className="kyc-info-banner" style={{ marginBottom: 16 }}>
                  <span>
                    We filled the agreement with your KYC details. You can edit them below. The greyed-out fields are set by ShivAI or when you invest, and cannot be edited.
                    {' '}
                    <a href={AGREEMENT_PDF} target="_blank" rel="noreferrer" style={{ color: '#9D6FFF' }}>Read the full agreement ↗</a>
                  </span>
                </div>

                {FIELD_GROUPS.map((g) => (
                  <div key={g.title} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.6, margin: '6px 0 8px' }}>{g.title}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '4px 16px' }}>
                      {g.fields.map((f) => (
                        <div className="kyc-form__group" key={f.name}>
                          <label className="kyc-form__label" htmlFor={`pa-${f.name}`}>
                            {f.label}{f.required && <span className="kyc-form__req"> *</span>}
                          </label>
                          <input
                            id={`pa-${f.name}`}
                            className={`kyc-form__input${f.fixed ? ' kyc-form__input--locked' : ''}${errors[f.name] ? ' kyc-form__input--err' : ''}`}
                            value={f.fixed ? fixedValue(f.name, values) : (values[f.name] || '')}
                            onChange={(e) => setField(f.name, e.target.value)}
                            placeholder={f.fixed ? 'To be provided by ShivAI' : ''}
                            disabled={!!f.fixed}
                            maxLength={120}
                          />
                          <span className="kyc-form__error">{errors[f.name] || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {genError && <div className="kyc-form__api-error" style={{ marginTop: 8 }}>{genError}</div>}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" className="db-btn db-btn--ghost" onClick={close}>Cancel</button>
                  <button type="button" className="db-btn db-btn--primary" onClick={goSign}>Continue to e-sign</button>
                </div>
              </>
            )}

            {step === 'review' && pdf && (
              <>
                <iframe
                  title="Signed agreement"
                  src={`${pdf.url}#toolbar=0&navpanes=0`}
                  style={{ width: '100%', height: '56vh', minHeight: 320, border, borderRadius: 10, background: '#fff' }}
                />
                <a href={pdf.url} download={SIGNED_FILENAME} style={{ display: 'inline-block', margin: '10px 0 14px', fontSize: 13, color: '#9D6FFF' }}>
                  Download a copy of the signed PDF ↓
                </a>
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{ marginTop: 4 }} />
                  <span>I have reviewed the signed Private Participation Agreement above. I confirm the details are correct and I agree to be legally bound by it, including the Risk Statement in Schedule 3.</span>
                </label>
                {submitError && <div className="kyc-form__api-error" style={{ marginTop: 12 }}>{submitError}</div>}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 16 }}>
                  <button type="button" className="db-btn db-btn--ghost" onClick={() => setStep('fill')} disabled={submitting}>← Edit details / re-sign</button>
                  <button type="button" className="db-btn db-btn--primary" onClick={accept} disabled={!checked || submitting}>
                    {submitting ? 'Recording…' : 'Accept & Continue'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ESignModal open={signOpen} onClose={() => setSignOpen(false)} onApply={applySignature} busy={busy} />
    </>
  );
}
