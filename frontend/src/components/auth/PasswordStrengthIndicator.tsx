import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

const strengthConfigs: Record<number, StrengthConfig> = {
  0: {
    label: 'Very Weak',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  1: {
    label: 'Weak',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  2: {
    label: 'Moderate',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  },
  3: {
    label: 'Strong',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  4: {
    label: 'Very Strong',
    color: 'bg-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800'
  }
};

const calculatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
  if (!password) {
    return { score: 0, feedback: ['Password is required'] };
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

  return {
    score,
    feedback: feedback.length > 0 ? feedback : ['Password meets all requirements']
  };
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, feedback } = calculatePasswordStrength(password);
  const config = strengthConfigs[score];

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`flex-1 transition-all duration-300 ${
                  level < score ? config.color : 'bg-transparent'
                }`}
                style={{ marginRight: level < 4 ? '2px' : '0' }}
              />
            ))}
          </div>
        </div>
        <span className={`text-xs font-medium ${config.textColor} min-w-[80px] text-right flex items-center justify-end`}>
          <Shield className="w-3 h-3 mr-1" />
          {config.label}
        </span>
      </div>

      {/* Feedback */}
      {score < 4 && feedback.length > 0 && (
        <div className={`${config.bgColor} rounded-lg p-2`}>
          <div className="flex items-start">
            <AlertCircle className={`w-4 h-4 ${config.textColor} mt-0.5 mr-2 flex-shrink-0`} />
            <div className="flex-1">
              <p className={`text-xs ${config.textColor} font-medium mb-1`}>
                {score === 0 ? 'Password is too weak' : 'Suggestions to improve:'}
              </p>
              <ul className={`text-xs ${config.textColor} space-y-0.5`}>
                {feedback.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {score === 4 && (
        <div className={`${config.bgColor} rounded-lg p-2`}>
          <p className={`text-xs ${config.textColor} font-medium flex items-center`}>
            <Shield className="w-4 h-4 mr-2" />
            Excellent! Your password is very strong.
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
