import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authTokenState, userState } from '../recoil/auth';
import authService from '../services/authService';
import apiService from '../services/apiService';
import { getToken, getUser, setToken as ssSetToken, setUser as ssSetUser, clearAuth } from '../utils/secureStorage';

const ProtectedRoute = ({ children }) => {
  // Determine initial status synchronously from localStorage so we avoid
  // an unnecessary loading flash when cached data is already present.
  const [status, setStatus] = useState(() => {
    const storedToken = getToken();
    if (!storedToken) return 'redirect';
    const cachedUser = getUser();
    return cachedUser ? 'ok' : 'checking';
  });

  const [, setToken] = useRecoilState(authTokenState);
  const [, setUser] = useRecoilState(userState);

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      setStatus('redirect');
      return;
    }

    // Pre-seed Recoil synchronously from cache so components get real data
    // on their very first render, before the async getMe() completes.
    const cachedUser = getUser();
    if (cachedUser) {
      setUser(cachedUser);
      setToken(storedToken);
    }

    // Make sure the in-memory API client has the token before calling /me
    apiService.setToken(storedToken);

    authService.getMe()
      .then(res => {
        // API shape: { success, data: { user: {...} } } — extract the nested user
        const userData = res?.data?.user || res?.data || res?.user || res;
        setUser(userData);
        setToken(storedToken);
        ssSetUser(userData);
        setStatus('ok');
      })
      .catch((err) => {
        // Only force logout for genuine auth failures (401 / token errors).
        // Server errors (5xx) or backend bugs should NOT log the user out —
        // we keep the session and let them continue with cached data.
        const isAuth = err?.isAuthError === true || err?.status === 401;
        if (!isAuth) {
          console.warn('getMe() failed with non-auth error; keeping session.', err);
          // If we have a cached user, stay logged in. Otherwise, redirect.
          if (cachedUser) {
            setStatus('ok');
          } else {
            // No cached profile and the server can't return one — stay on the
            // page but show with whatever defaults exist. Mark as ok to render.
            setStatus('ok');
          }
          return;
        }
        // Token expired or invalid — clear everything and send to login
        setToken(null);
        setUser(null);
        clearAuth();
        apiService.setToken(null);
        setStatus('redirect');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'redirect') return <Navigate to="/login" replace />;

  if (status === 'checking') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#070A29',
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(157,111,255,0.25)',
          borderTopColor: '#9D6FFF',
          borderRadius: '50%',
          animation: 'pr-spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes pr-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
