/**
 * Validation utilities for user input
 */

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (email.length > 255) {
    errors.push('Email address is too long (maximum 255 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password complexity requirements
 * Requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculates password strength score (0-4)
 * 0 = Very Weak
 * 1 = Weak
 * 2 = Moderate
 * 3 = Strong
 * 4 = Very Strong
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      feedback: ['Password is required'],
      isValid: false
    };
  }
  
  let score = 0;
  const feedback: string[] = [];
  
  // Length check
  if (password.length >= 12) {
    score++;
  } else if (password.length >= 8) {
    feedback.push('Password should be at least 12 characters');
  } else {
    feedback.push('Password is too short (minimum 12 characters)');
  }
  
  // Character diversity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Add both uppercase and lowercase letters');
  }
  
  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Add numbers');
  }
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    feedback.push('Add special characters');
  }
  
  // Bonus for extra length
  if (password.length >= 16) {
    score = Math.min(4, score + 1);
  }
  
  const validation = validatePassword(password);
  
  return {
    score,
    feedback: feedback.length > 0 ? feedback : ['Password meets all requirements'],
    isValid: validation.isValid
  };
};

/**
 * Validates that password and confirm password match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
    return { isValid: false, errors };
  }
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes user input by trimming whitespace
 */
export const sanitizeInput = (input: string): string => {
  return input ? input.trim() : '';
};
