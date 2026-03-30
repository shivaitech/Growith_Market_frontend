import apiService from './apiService';

class AuthService {
  async validateEmail(email, mode = 'signin') {
    return apiService.post('/auth/validate-email', { email, mode });
  }

  async register(userData) {
    return apiService.post('/auth/register', userData);
  }

  async login(credentials) {
    return apiService.post('/auth/login', credentials);
  }

  async googleLogin(credential) {
    return apiService.post('/auth/google', { credential });
  }

  async refreshToken() {
    return apiService.post('/auth/refresh-token');
  }

  async forgotPassword(email) {
    return apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(data) {
    return apiService.post('/auth/reset-password', data);
  }

  async verifyEmail(data) {
    return apiService.post('/auth/verify-email', data);
  }

  async submitKyc(data) {
    return apiService.post('/auth/kyc', data);
  }

  logout() {
    apiService.setToken(null);
  }

  setToken(token) {
    apiService.setToken(token);
  }
}

const authService = new AuthService();
export default authService;