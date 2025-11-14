import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface EditProfileProps {
  user: any;
  onUpdateUser: (user: any) => void;
  language: string;
}

export function EditProfile({ user, onUpdateUser, language }: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const translations = {
    en: {
      title: 'Edit Profile',
      name: 'Full Name',
      email: 'Email Address',
      save: 'Save Changes',
      back: 'Back',
      success: 'Profile updated successfully!',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email'
    },
    hi: {
      title: 'प्रोफाइल संपादित करें',
      name: 'पूरा नाम',
      email: 'ईमेल पता',
      save: 'परिवर्तन सहेजें',
      back: 'वापस',
      success: 'प्रोफाइल सफलतापूर्वक अपडेट हो गया!',
      nameRequired: 'नाम आवश्यक है',
      emailRequired: 'ईमेल आवश्यक है',
      emailInvalid: 'कृपया एक वैध ईमेल दर्ज करें'
    }
  };

  const t = translations[language] || translations.en;

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.emailInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Update user in localStorage
      const updatedUser = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update user accounts if exists
      const savedAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
      const accountIndex = savedAccounts.findIndex((acc: any) => acc.id === user.id);
      if (accountIndex !== -1) {
        savedAccounts[accountIndex] = { ...savedAccounts[accountIndex], name: formData.name, email: formData.email };
        localStorage.setItem('userAccounts', JSON.stringify(savedAccounts));
      }
      
      onUpdateUser(updatedUser);
      alert(t.success);
      navigate('/');
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl">{t.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">{t.name}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t.save}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}