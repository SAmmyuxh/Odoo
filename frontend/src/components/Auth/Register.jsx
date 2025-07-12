import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (!acceptTerms) {
    alert('Please accept the terms to proceed.');
    return;
  }

  setIsLoading(true);

  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      name,
      email,
      password,
      location: 'India', // Optional: add location field if needed
    });

    const { token, message } = res.data;

    // ✅ Save token in localStorage
    localStorage.setItem('token', token);

    alert(message || 'Registered successfully!');
    navigate('/login'); // ⬅️ Redirect to login page
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Registration failed');
  } finally {
    setIsLoading(false);
  }
};

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden mt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main register container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Join Us</h2>
              <p className="text-gray-300">Create your account to get started</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength(password) >= 3 ? 'text-green-400' : 
                        passwordStrength(password) >= 2 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {getPasswordStrengthText(passwordStrength(password))}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength(password) 
                              ? getPasswordStrengthColor(passwordStrength(password))
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:bg-white/20 ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : confirmPassword && password === confirmPassword 
                        ? 'border-green-500 focus:ring-green-500' 
                        : 'border-white/20 focus:ring-emerald-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {confirmPassword && password === confirmPassword && (
                    <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  )}
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-600 bg-white/10 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !acceptTerms || password !== confirmPassword}
                onClick={handleSubmit}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                  isLoading || !acceptTerms || password !== confirmPassword
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Social registration buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
              
              <button className="w-full flex items-center justify-center py-3 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.224.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
                Sign up with Apple
              </button>
            </div>

            {/* Sign in link */}
            <p className="text-center text-gray-400 mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;