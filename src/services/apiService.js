import { clearAuth } from '../utils/secureStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.token = null;
  }

  _handleUnauthorized() {
    this.token = null;
    clearAuth();
    // Small delay so any in-flight state updates finish before redirect
    setTimeout(() => { window.location.replace('/login'); }, 100);
  }

  _isTokenError(status, message = '') {
    if (status === 401) return true;
    const msg = message.toLowerCase();
    return msg.includes('invalid token') || msg.includes('jwt expired') || msg.includes('token expired') || msg.includes('unauthorized') || msg.includes('not authenticated');
  }

  setToken(token) {
    this.token = token;
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        let errMessage = `HTTP error! status: ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody && errBody.message) errMessage = errBody.message;
        } catch {}
        if (this._isTokenError(response.status, errMessage)) {
          this._handleUnauthorized();
        }
        throw new Error(errMessage);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postForm(endpoint, formData) {
    // Do NOT set Content-Type — browser sets multipart/form-data with boundary automatically
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const response = await fetch(url, { method: 'POST', headers, body: formData });
    if (!response.ok) {
      let errMessage = `HTTP error! status: ${response.status}`;
      try { const b = await response.json(); if (b?.message) errMessage = b.message; } catch {}
      if (this._isTokenError(response.status, errMessage)) {
        this._handleUnauthorized();
      }
      throw new Error(errMessage);
    }
    return response.json();
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ── KYC ──────────────────────────────────────────────────

  /**
   * POST /api/v1/investor/kyc
   * Submit KYC — multipart/form-data
   * Text fields: fullLegalName, dateOfBirth (DD-MM-YYYY), nationality,
   *   countryOfResidence, city, stateProvince, phoneNumber, streetAddress,
   *   aadhaarNumber, panNumber, supportingDocName (optional), termsAgreed
   * File fields: aadhaarFront, aadhaarBack, panFront, supportingDoc (optional)
   */
  submitKyc(formData) {
    return this.postForm('/kyc', formData);
  }

  /**
   * GET /api/v1/investor/kyc
   * Returns full KYC + user data
   */
  getKyc() {
    return this.get('/kyc');
  }

  /**
   * GET /api/v1/investor/kyc/status
   * Returns KYC status only: { status: 'not_started' | 'pending' | 'approved' | 'rejected' }
   */
  getKycStatus() {
    return this.get('/kyc/status');
  }

  // ── Wallet / Token Requests ──────────────────────────────

  /**
   * GET /api/v1/investor/wallet
   * Returns the investor's wallet info: approved tokens, balances, address.
   */
  getWallet() {
    return this.get('/wallet');
  }

  // ── Tokens ──────────────────────────────────────────────

  /**
   * GET /api/v1/investor/tokens
   * Returns all available tokens.
   */
  getTokens() {
    return this.get('/tokens');
  }

  /**
   * GET /api/v1/investor/tokens/:id
   * Returns a single token by its ID.
   */
  getToken(id) {
    return this.get(`/tokens/${id}`);
  }

  // ── Token Requests ──────────────────────────────────────

  /**
   * GET /api/v1/investor/tokens/requests
   * Returns all token purchase requests for this investor.
   */
  getTokenRequests() {
    return this.get('/tokens/requests');
  }

  /**
   * GET /api/v1/investor/tokens/requests/:requestId
   * Returns a single token purchase request.
   */
  getTokenRequest(requestId) {
    return this.get(`/tokens/requests/${requestId}`);
  }

  /**
   * POST /api/v1/investor/tokens/requests
   * Create a token purchase request.
   * Accepts multipart/form-data:
   *   tokenName, ticker, amountUsd, tokenQty, purchaseRef, method
   *   screenshot (File, optional)
   */
  createTokenRequest(formData) {
    return this.postForm('/tokens/requests', formData);
  }

  /**
   * GET /api/v1/investor/tokens/my-purchases
   * Returns all token purchases for the logged-in investor.
   */
  getMyPurchases() {
    return this.get('/tokens/my-purchases');
  }

  /**
   * GET /api/v1/investor/wallet/transactions
   * Returns all wallet transaction history for the logged-in investor.
   */
  getWalletTransactions() {
    return this.get('/wallet/transactions');
  }

  // ── Wallet Requests ─────────────────────────────────────

  /**
   * GET /api/v1/investor/wallet/requests
   * Returns all wallet requests (withdrawals, redemptions, etc.) for the investor.
   */
  getWalletRequests() {
    return this.get('/wallet/requests');
  }

  /**
   * GET /api/v1/investor/wallet/requests/:requestId
   * Returns a single wallet request by ID.
   */
  getWalletRequest(requestId) {
    return this.get(`/wallet/requests/${requestId}`);
  }

  /**
   * GET /api/v1/investor/direct-airdrops
   * Returns all direct airdrops received by the investor.
   */
  getDirectAirdrops() {
    return this.get('/direct-airdrops');
  }

  /**
   * POST /api/v1/investor/wallet/requests
   * Create a new wallet request (withdrawal / redemption).
   * Body: { type, amount, currency, walletAddress, notes? }
   */
  createWalletRequest(data) {
    return this.post('/wallet/requests', data);
  }
}

const apiService = new ApiService();    
export default apiService;