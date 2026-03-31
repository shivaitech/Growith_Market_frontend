import { atom, selector } from 'recoil';
import authService from '../services/authService';
import { getToken, getUser, setToken as ssSetToken, setUser as ssSetUser, setRefreshToken as ssSetRefreshToken, clearAuth } from '../utils/secureStorage';

// Atom for storing the authentication token
export const authTokenState = atom({
  key: 'authTokenState',
  default: getToken(),
});

// Atom for storing user data
export const userState = atom({
  key: 'userState',
  default: getUser(),
});

// Selector for checking if user is authenticated
export const isAuthenticatedState = selector({
  key: 'isAuthenticatedState',
  get: ({ get }) => {
    const token = get(authTokenState);
    return !!token;
  },
});

// Selector for user data, with caching to avoid unnecessary fetches
export const userDataState = selector({
  key: 'userDataState',
  get: ({ get }) => {
    return get(userState);
  },
  set: ({ set }, newValue) => {
    set(userState, newValue);
    ssSetUser(newValue);
  },
});

// Function to initialize token from localStorage
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    authService.setToken(token);
  }
};

// Action to login
export const login = async (setAuthToken, setUser, credentials) => {
  try {
    const response = await authService.login(credentials);
    const token   = response?.data?.tokens?.accessToken  || response?.token;
    const refresh = response?.data?.tokens?.refreshToken || '';
    const user    = response?.data?.user                 || response?.user;
    setAuthToken(token);
    setUser(user);
    authService.setToken(token);
    ssSetToken(token);
    ssSetRefreshToken(refresh);
    ssSetUser(user);
    return response;
  } catch (error) {
    throw error;
  }
};

// Action to logout
export const logout = (setAuthToken, setUser) => {
  authService.logout();
  setAuthToken(null);
  setUser(null);
  clearAuth();
};