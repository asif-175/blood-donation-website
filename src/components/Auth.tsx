import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Mail, Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import { localAuthService } from '../services/localAuthService';




interface AuthProps {
  onLogin: (user: any) => void;
  language: 'en' | 'hi';
}

export function Auth({ onLogin, language }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true); // Default to Login
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'donor'
  });
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  
  // Check if user is already logged in
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.role === 'admin') {
        navigate('/admin-welcome');
      } else {
        navigate('/home');
      }
    }
  }, [navigate]);

  const translations = {
    en: {
      login: 'Login',
      signup: 'Create Account',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number',
      city: 'City',
      role: 'Role',
      donor: 'Blood Donor',
      admin: 'Admin',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Login',
      title: 'Welcome to LifeLink',
      subtitle: 'Save lives through blood donation',
      signupTitle: 'Create Your Account',
      signupSubtitle: 'Join our community of life-savers',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to your account',
      loading: 'Please wait...',
      successTitle: 'Account Created Successfully!',
      successMessage: 'You can now login with your credentials',
      proceedToLogin: 'Proceed to Login',
      errors: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        passwordRequired: 'Password is required',
        passwordShort: 'Password must be at least 6 characters',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid 10-digit phone number',
        cityRequired: 'City is required'
      }
    },
    hi: {
      login: 'लॉगिन',
      signup: 'साइन अप',
      name: 'पूरा नाम',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      role: 'भूमिका',
      donor: 'रक्तदाता',
      admin: 'एडमिन',
      signInBtn: 'साइन इन करें',
      signUpBtn: 'खाता बनाएं',
      switchToSignup: 'खाता नहीं है? साइन अप करें',
      switchToLogin: 'पहले से खाता है? लॉगिन करें',
      title: 'LifeLink में शामिल हों',
      subtitle: 'रक्तदान के माध्यम से जीवन बचाएं',
      loading: 'कृपया प्रतीक्षा करें...',
      errors: {
        nameRequired: 'नाम आवश्यक है',
        emailRequired: 'ईमेल आवश्यक है',
        emailInvalid: 'कृपया एक वैध ईमेल दर्ज करें',
        passwordRequired: 'पासवर्ड आवश्यक है',
        passwordShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए'
      }
    }
  };

  const t = translations[language] || translations.en;

  const validateForm = () => {
    const newErrors: any = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = t.errors.nameRequired;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = t.errors.phoneRequired;
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = t.errors.phoneInvalid;
      }
      if (!formData.city.trim()) {
        newErrors.city = t.errors.cityRequired;
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = t.errors.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.errors.passwordShort;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Check for admin credentials from env
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (adminEmail && adminPassword && formData.email === adminEmail && formData.password === adminPassword) {
          const adminUser = {
            id: 'admin_001',
            name: 'Admin',
            email: adminEmail,
            role: 'admin',
            isAdmin: true
          };
          onLogin(adminUser);
          navigate('/admin-welcome');
          return;
        }
        
        // Login with Supabase or localStorage fallback
        let user, profile;
        try {
          const result = await supabaseService.signIn(formData.email, formData.password);
          user = result.user;
          profile = await supabaseService.getProfile(user.id);
        } catch (supabaseError) {
          console.log('Supabase failed, using localStorage:', supabaseError);
          const result = await localAuthService.signIn(formData.email, formData.password);
          user = result.user;
          profile = user;
        }
        
        if (user) {
          const userData = {
            id: user.id,
            name: profile?.name || user.email?.split('@')[0] || 'User',
            email: user.email!,
            role: profile?.role || 'donor',
            phone: profile?.phone,
            city: profile?.city
          };
          onLogin(userData);
          navigate('/home');
        }
      } else {
        // Signup with Supabase or localStorage fallback
        try {
          await supabaseService.signUp(formData.email, formData.password, {
            name: formData.name,
            phone: formData.phone,
            city: formData.city
          });
        } catch (supabaseError) {
          console.log('Supabase failed, using localStorage:', supabaseError);
          await localAuthService.signUp(formData.email, formData.password, {
            name: formData.name,
            phone: formData.phone,
            city: formData.city
          });
        }
        
        setSignupSuccess(true);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Email already exists. Please use a different email or login.';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'Password must be at least 6 characters long.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error and submit error when user starts typing
    if (errors[name] || errors.submit) {
      setErrors((prev: any) => ({ ...prev, [name]: '', submit: '' }));
    }
  };

  const handleProceedToLogin = () => {
    setSignupSuccess(false);
    setIsLogin(true);
    setFormData({ 
      name: '', 
      email: formData.email, // Keep email for convenience
      password: '', 
      phone: '',
      city: '',
      role: 'donor' 
    });
    setErrors({});
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white py-12 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.successTitle}</h2>
          <p className="text-gray-600 mb-8">{t.successMessage}</p>
          <Button 
            onClick={handleProceedToLogin}
            className="bg-red-600 hover:bg-red-700 px-8 py-3"
          >
            {t.proceedToLogin}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white py-8 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex items-center justify-center mb-3"
            >
              <Heart className="h-10 w-10 text-red-500" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {isLogin ? t.loginTitle : t.signupTitle}
            </h1>
            <p className="text-sm text-gray-500">
              {isLogin ? t.loginSubtitle : t.signupSubtitle}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-2 pt-5 px-6">
              <CardTitle className="text-center text-xl">
                {isLogin ? t.login : t.signup}
              </CardTitle>
              {!isLogin && (
                <p className="text-center text-xs text-gray-500 mt-1">
                  Step 1: Create your account to get started
                </p>
              )}
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name">{t.name} *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">{t.phone} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'border-red-500' : ''}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="city">{t.city} *</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'border-red-500' : ''}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">{t.email} *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">{t.password} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>



                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.loading}</span>
                    </div>
                  ) : (
                    isLogin ? t.signInBtn : t.signUpBtn
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({ 
                        name: '', 
                        email: '', 
                        password: '', 
                        phone: '',
                        city: '',
                        role: 'donor' 
                      });
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    {isLogin ? t.switchToSignup : t.switchToLogin}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>



          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 mb-6"
          >
            <div className="flex justify-between items-center px-4">
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="bg-red-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-sm text-gray-600 font-medium text-center">
                  {language === 'en' ? 'Save Lives' : 'जीवन बचाएं'}
                </span>
              </div>

              <div className="w-px h-12 bg-gray-200" />

              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-sm text-gray-600 font-medium text-center">
                  {language === 'en' ? 'Join Community' : 'समुदाय में शामिल हों'}
                </span>
              </div>

              <div className="w-px h-12 bg-gray-200" />

              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="bg-green-100 p-3 rounded-full">
                  <Lock className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-sm text-gray-600 font-medium text-center">
                  {language === 'en' ? 'Secure Platform' : 'सुरक्षित मंच'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}