import { atom, selector } from 'recoil';
import authService from '../services/authService';

// Atom for storing the authentication token
export const authTokenState = atom({
  key: 'authTokenState',
  default: localStorage.getItem('authToken') || null,
});

// Atom for storing user data
export const userState = atom({
  key: 'userState',
  default: JSON.parse(localStorage.getItem('user')) || null,
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
    localStorage.setItem('user', JSON.stringify(newValue));
  },
});

// Function to initialize token from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    authService.setToken(token);
  }
};

// Action to login
export const login = async (setAuthToken, setUser, credentials) => {
  try {
    const response = await authService.login(credentials);
    const { token, user } = response;
    setAuthToken(token);
    setUser(user);
    authService.setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
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
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};