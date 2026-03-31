/**
 * secureStorage — lightweight obfuscated localStorage wrapper.
 *
 * Data is XOR-ciphered with a fixed app key then base64-encoded, making it
 * unreadable to casual observers while remaining fully synchronous and
 * dependency-free. This is NOT cryptographic-grade security; it prevents
 * casual inspection of tokens/user objects in DevTools → Application → Storage.
 *
 * Storage keys are also obfuscated so the purpose isn't obvious.
 */

// App-specific cipher key.
const _K = 'Gr0w!th$$3cur3_Pl4tf0rm_2026';

// Obfuscated localStorage key names
const _KEYS = {
  token:        '_gw_a',   // access token
  refreshToken: '_gw_r',   // refresh token
  user:         '_gw_d',   // user object
};

// XOR cipher using TextEncoder so Unicode/emoji in JSON is handled correctly.
const _xor = (input, key) => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const inBytes  = enc.encode(input);
  const keyBytes = enc.encode(key);
  const out = new Uint8Array(inBytes.length);
  for (let i = 0; i < inBytes.length; i++) {
    out[i] = inBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  // btoa expects a binary string of latin1 bytes
  return btoa(String.fromCharCode(...out));
};

const _dxor = (encoded, key) => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const keyBytes = enc.encode(key);
  const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return dec.decode(out);
};

// ── Token ─────────────────────────────────────────────────────────────────────

export const setToken = (token) => {
  if (!token) { localStorage.removeItem(_KEYS.token); return; }
  localStorage.setItem(_KEYS.token, _xor(token, _K));
};

export const getToken = () => {
  try {
    const v = localStorage.getItem(_KEYS.token);
    return v ? _dxor(v, _K) : null;
  } catch { return null; }
};

export const removeToken = () => localStorage.removeItem(_KEYS.token);

// ── Refresh Token ──────────────────────────────────────────────────────────────────────

export const setRefreshToken = (token) => {
  if (!token) { localStorage.removeItem(_KEYS.refreshToken); return; }
  localStorage.setItem(_KEYS.refreshToken, _xor(token, _K));
};

export const getRefreshToken = () => {
  try {
    const v = localStorage.getItem(_KEYS.refreshToken);
    return v ? _dxor(v, _K) : null;
  } catch { return null; }
};

export const removeRefreshToken = () => localStorage.removeItem(_KEYS.refreshToken);

// ── User ──────────────────────────────────────────────────────────────────────

export const setUser = (user) => {
  if (!user) { localStorage.removeItem(_KEYS.user); return; }
  localStorage.setItem(_KEYS.user, _xor(JSON.stringify(user), _K));
};

export const getUser = () => {
  try {
    const v = localStorage.getItem(_KEYS.user);
    if (!v) return null;
    return JSON.parse(_dxor(v, _K));
  } catch { return null; }
};

export const removeUser = () => localStorage.removeItem(_KEYS.user);

// ── Convenience ───────────────────────────────────────────────────────────────

export const clearAuth = () => {
  localStorage.removeItem(_KEYS.token);
  localStorage.removeItem(_KEYS.refreshToken);
  localStorage.removeItem(_KEYS.user);
};
