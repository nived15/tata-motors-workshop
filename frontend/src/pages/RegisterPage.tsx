import React from 'react';
import { toast } from 'react-toastify';
import RegisterForm from '../components/auth/RegisterForm';
import authService, { RegisterData } from '../services/auth.service';

const RegisterPage: React.FC = () => {
  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      
      if (response.success) {
        toast.success(response.message);
      } else if (response.errors && response.errors.length > 0) {
        response.errors.forEach((error) => toast.error(error));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0] || 
                          error.response?.data?.message || 
                          'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Money Manager</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Start tracking your income with secure and powerful tools
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm onSubmit={handleRegister} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
