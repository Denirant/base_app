import React, { useState } from 'react';
import { CheckCircle, Ban } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationCorrect, setIsVerificationCorrect] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; terms?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; terms?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (!isTermsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleVerify = () => {
    if (verificationCode === '1111') {
      setIsVerificationCorrect(true);
      alert('Login successful!');
    } else {
      alert('Incorrect verification code');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex w-full max-w-7xl">
        <div className="w-1/2 p-8">
          <div className="grid grid-cols-3 gap-4">
            <img src="/path/to/guide1.jpg" alt="Guide 1" className="rounded-lg shadow-md" />
            <img src="/path/to/guide2.jpg" alt="Guide 2" className="rounded-lg shadow-md" />
            <img src="/path/to/guide3.jpg" alt="Guide 3" className="rounded-lg shadow-md" />
            <img src="/path/to/guide4.jpg" alt="Guide 4" className="rounded-lg shadow-md" />
            <img src="/path/to/guide5.jpg" alt="Guide 5" className="rounded-lg shadow-md" />
            <img src="/path/to/guide6.jpg" alt="Guide 6" className="rounded-lg shadow-md" />
          </div>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <Ban className="inline-block mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <Ban className="inline-block mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the <a href="#" className="text-indigo-600 underline">terms and conditions</a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <Ban className="inline-block mr-1" />
                  {errors.terms}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-6">Verification</h3>
            <p className="text-gray-700 mb-4">Please enter the verification code sent to your email.</p>
            <div className="mb-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleVerify}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
            {isVerificationCorrect && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <CheckCircle className="inline-block mr-1" />
                Verification successful!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
