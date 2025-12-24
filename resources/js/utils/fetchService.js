/**
 * fetchService - Base HTTP Client
 * 
 * This service handles all HTTP requests with automatic CSRF token handling
 * for Laravel backend integration.
 */

class FetchService {
  constructor() {
    this.baseURL = '';
    this.csrfToken = this.getCsrfToken();
  }

  /**
   * Get CSRF token from meta tag
   */
  getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : null;
  }

  /**
   * Get default headers for requests
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    if (this.csrfToken) {
      headers['X-CSRF-TOKEN'] = this.csrfToken;
    }

    return headers;
  }

  /**
   * Get headers WITHOUT Content-Type (for FormData)
   * Browser will automatically set the correct Content-Type with boundary
   */
  getHeadersWithoutContentType(customHeaders = {}) {
    const headers = {
      'Accept': 'application/json',
      ...customHeaders,
    };

    if (this.csrfToken) {
      headers['X-CSRF-TOKEN'] = this.csrfToken;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `HTTP Error ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(options.headers),
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * POST request
   */
  async post(url, data = {}, options = {}) {
    const isFormData = data instanceof FormData;

    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: isFormData
        ? this.getHeadersWithoutContentType(options.headers)
        : this.getHeaders(options.headers),
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * PUT request
   */
  async put(url, data = {}, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * PATCH request
   */
  async patch(url, data = {}, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PATCH',
      headers: this.getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders(options.headers),
      ...options,
    });

    return this.handleResponse(response);
  }
}

const api = new FetchService();
export default api;