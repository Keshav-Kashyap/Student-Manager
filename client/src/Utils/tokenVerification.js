// utils/tokenVerification.js
import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { API_BASE } from '../config/api';
import toast from 'react-hot-toast';

/**
 * Token verification utility class
 * Handles all token-related operations like email verification, OAuth tokens, etc.
 * Optimized for cookie-based authentication
 */
export class TokenVerificationService {
  
  /**
   * Verify email token from URL parameters
   * @param {string} token - The verification token
   * @returns {Promise<Object>} - Verification result
   */
  static async verifyEmailToken(token) {
    try {
      const response = await fetch(`${API_BASE}/api/users/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies for authentication
      });

      const data = await response.json();
      console.log("Email verification response:", data);
      
      return {
        success: data.success,
        message: data.message || (data.success ? 'Email verified successfully!' : 'Email verification failed'),
        token: token,
        user: data.user,
        redirectUrl: data.success ? '/app/dashboard' : null
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: error.message
      };
    }
  }

  /**
   * Handle OAuth token from URL parameters (Google, Facebook, etc.)
   * @param {URLSearchParams} searchParams - URL search parameters
   * @param {Function} navigate - Navigation function
   * @returns {Promise<boolean>} - Returns true if token was handled
   */
  static async handleOAuthToken(searchParams, navigate) {
    const token = searchParams.get('token');
    
    if (!token) {
      return false;
    }

    try {
      console.log('🔑 OAuth token received');
      
      // For OAuth, the server should set HttpOnly cookies
      // We just need to refresh user data
      const user = await authAPI.refreshUser();
      
      if (user) {
        toast.success('Login successful!');
        
        // Navigate based on user role
        const targetRoute = user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard';
        navigate(targetRoute, { replace: true });
        
        return true;
      }
      
      throw new Error('Failed to refresh user data');
      
    } catch (error) {
      console.error('Error handling OAuth token:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  }

  /**
   * Check for various tokens in URL and handle them appropriately
   * @param {URLSearchParams} searchParams - URL search parameters
   * @param {Function} navigate - Navigation function
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Token handling result
   */
  static async handleUrlTokens(searchParams, navigate, options = {}) {
    const result = {
      tokenFound: false,
      tokenType: null,
      handled: false,
      result: null
    };

    // Check for email verification token
    const emailToken = searchParams.get('token');
    const verifyEmail = searchParams.get('verify') === 'email';
    
    if (emailToken && (verifyEmail || options.expectEmailVerification)) {
      result.tokenFound = true;
      result.tokenType = 'email_verification';
      
      try {
        const verificationResult = await this.verifyEmailToken(emailToken);
        result.result = verificationResult;
        result.handled = true;
        
        if (verificationResult.success) {
          toast.success(verificationResult.message);
          
          // For cookie-based auth, no need to store token manually
          // The server should have set the auth cookie already
          
          // Navigate after delay
          setTimeout(() => {
            navigate(verificationResult.redirectUrl || '/app/dashboard');
          }, 2000);
        } else {
          toast.error(verificationResult.message);
        }
        
      } catch (error) {
        result.result = { success: false, message: error.message };
        toast.error('Verification failed');
      }
      
      return result;
    }

    // Check for OAuth token (login/signup)
    if (emailToken && !verifyEmail) {
      result.tokenFound = true;
      result.tokenType = 'oauth';
      
      const handled = await this.handleOAuthToken(searchParams, navigate);
      result.handled = handled;
      
      return result;
    }

    return result;
  }

  /**
   * Resend verification email
   * @param {string} email - User email address
   * @returns {Promise<Object>} - Resend result
   */
  static async resendVerificationEmail(email) {
    try {
      const response = await fetch(`${API_BASE}/api/users/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Verification email sent successfully!');
      } else {
        toast.error(data.message || 'Failed to resend email');
      }
      
      return {
        success: data.success,
        message: data.message || (data.success ? 'Email sent successfully' : 'Failed to send email')
      };
      
    } catch (error) {
      console.error('Resend email error:', error);
      toast.error('Network error. Please try again.');
      
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: error.message
      };
    }
  }

  /**
   * Extract email from URL parameters
   * @param {URLSearchParams} searchParams - URL search parameters  
   * @returns {string|null} - Decoded email or null
   */
  static getEmailFromParams(searchParams) {
    const email = searchParams.get('email');
    return email ? decodeURIComponent(email) : null;
  }

  /**
   * Check authentication status (for cookie-based auth)
   * @returns {Promise<Object>} - Auth status result
   */
  static async checkAuthStatus() {
    try {
      const response = await fetch(`${API_BASE}/api/users/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies
      });

      const data = await response.json();
      
      return {
        isAuthenticated: data.isAuthenticated || false,
        user: data.user || null,
        message: data.message
      };
    } catch (error) {
      console.error('Auth status check error:', error);
      return {
        isAuthenticated: false,
        user: null,
        error: error.message
      };
    }
  }

  /**
   * Logout user (clear server-side session/cookie)
   * @returns {Promise<Object>} - Logout result
   */
  static async logout() {
    try {
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Logged out successfully');
      }
      
      return {
        success: data.success || true,
        message: data.message || 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Logout failed',
        error: error.message
      };
    }
  }

  /**
   * Legacy methods for backward compatibility
   * These are kept for existing code but not recommended for cookie-based auth
   */
  
  /**
   * @deprecated Use cookie-based authentication instead
   */
  static storeAuthToken(token, options = {}) {
    console.warn('storeAuthToken is deprecated for cookie-based auth');
    console.log('Token received (not stored):', token);
    
    if (options.onTokenStored) {
      options.onTokenStored(token);
    }
  }

  /**
   * @deprecated Use logout() method instead
   */
  static clearAuthToken(options = {}) {
    console.warn('clearAuthToken is deprecated for cookie-based auth');
    
    if (options.onTokenCleared) {
      options.onTokenCleared();
    }
  }

  /**
   * @deprecated Not needed for cookie-based auth
   */
  static isTokenExpired(maxAge = 24 * 60 * 60 * 1000) {
    console.warn('isTokenExpired is deprecated for cookie-based auth');
    return false; // Server handles cookie expiration
  }
}

/**
 * React hook for handling token verification with cookie-based auth
 * @param {Object} options - Hook options
 * @returns {Object} - Hook state and methods
 */
export const useTokenVerification = (options = {}) => {
  const [state, setState] = React.useState({
    isLoading: false,
    isVerifying: false,
    status: 'idle', // 'idle', 'verifying', 'success', 'error', 'sent'
    message: '',
    error: null,
    isAuthenticated: false,
    user: null
  });

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Check auth status on hook initialization
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await TokenVerificationService.checkAuthStatus();
      updateState({
        isAuthenticated: authStatus.isAuthenticated,
        user: authStatus.user
      });
    };
    
    checkAuth();
  }, []);

  const verifyEmailToken = async (token) => {
    updateState({ isVerifying: true, status: 'verifying', message: 'Verifying your email address...' });
    
    try {
      const result = await TokenVerificationService.verifyEmailToken(token);
      
      if (result.success) {
        updateState({
          isVerifying: false,
          status: 'success',
          message: result.message,
          error: null,
          isAuthenticated: true,
          user: result.user
        });
        
        return result;
      } else {
        updateState({
          isVerifying: false,
          status: 'error',
          message: result.message,
          error: result.error
        });
        
        return result;
      }
    } catch (error) {
      updateState({
        isVerifying: false,
        status: 'error',
        message: 'Verification failed. Please try again.',
        error: error.message
      });
      
      return { success: false, message: error.message };
    }
  };

  const resendEmail = async (email) => {
    updateState({ isLoading: true });
    
    try {
      const result = await TokenVerificationService.resendVerificationEmail(email);
      
      if (result.success) {
        updateState({
          isLoading: false,
          status: 'sent',
          message: 'Verification email sent successfully! Please check your email.',
          error: null
        });
      } else {
        updateState({
          isLoading: false,
          error: result.message
        });
      }
      
      return result;
    } catch (error) {
      updateState({
        isLoading: false,
        error: error.message
      });
      
      return { success: false, message: error.message };
    }
  };

  const handleUrlTokens = async (searchParams, navigate) => {
    return await TokenVerificationService.handleUrlTokens(searchParams, navigate, options);
  };

  const logout = async () => {
    const result = await TokenVerificationService.logout();
    
    if (result.success) {
      updateState({
        isAuthenticated: false,
        user: null,
        status: 'idle',
        message: '',
        error: null
      });
    }
    
    return result;
  };

  return {
    ...state,
    verifyEmailToken,
    resendEmail,
    handleUrlTokens,
    logout,
    updateState
  };
};

// Export default service for direct usage
export default TokenVerificationService;