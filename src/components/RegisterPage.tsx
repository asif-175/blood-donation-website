import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Phone, MapPin, Calendar, Droplet, Upload, CheckCircle, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RegisterPageProps {
  language: string;
  user: any;
}

export function RegisterPage({ language, user }: RegisterPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    weight: '',
    healthStatus: [],
    lastDonation: '',
    emergencyContact: '',
    emergencyPhone: '',
    photoUrl: '',
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const translations = {
    en: {
      title: 'Register as Blood Donor',
      subtitle: 'Join our community of life-savers',
      steps: {
        personal: 'Personal Information',
        medical: 'Medical Information',
        contact: 'Contact Details',
        review: 'Review & Submit'
      },
      fields: {
        fullName: 'Full Name',
        age: 'Age',
        gender: 'Gender',
        bloodGroup: 'Blood Group',
        phone: 'Phone Number',
        email: 'Email Address',
        address: 'Address',
        city: 'City',
        state: 'State',
        pincode: 'PIN Code',
        weight: 'Weight (kg)',
        healthStatus: 'Health Status',
        lastDonation: 'Last Donation Date',
        emergencyContact: 'Emergency Contact Name',
        emergencyPhone: 'Emergency Contact Phone',
        photo: 'Profile Photo'
      },
      options: {
        male: 'Male',
        female: 'Female',
        other: 'Other',
        healthConfirm: 'I confirm that I am in good health and eligible to donate blood'
      },
      buttons: {
        next: 'Next Step',
        previous: 'Previous',
        submit: 'Register as Donor',
        uploadPhoto: 'Upload Photo'
      },
      validation: {
        nameRequired: 'Full name is required',
        ageRequired: 'Age is required',
        ageInvalid: 'Age must be between 18 and 65',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid 10-digit phone number',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        weightRequired: 'Weight is required',
        weightInvalid: 'Weight must be at least 50kg'
      },
      eligibility: {
        title: 'Donor Eligibility',
        criteria: [
          'Age between 18-65 years',
          'Weight at least 50kg',
          'Good general health',
          'No recent tattoos or piercings',
          'Last donation was 3+ months ago'
        ]
      },
      benefits: {
        title: 'Donor Benefits',
        list: [
          'Free health check-up',
          'Blood group certificate',
          'Donor ID card',
          'Priority in emergency',
          'Community recognition'
        ]
      },
      success: 'Registration successful! Welcome to the LifeLink community.',
      loginPrompt: 'Please login to register as a donor.'
    },
    hi: {
      title: 'रक्तदाता के रूप में पंजीकरण',
      subtitle: 'जीवनदाताओं के हमारे समुदाय से जुड़ें',
      steps: {
        personal: 'व्यक्तिगत जानकारी',
        medical: 'चिकित्सा जानकारी',
        contact: 'संपर्क विवरण',
        review: 'समीक्षा और सबमिट'
      },
      fields: {
        fullName: 'पूरा नाम',
        age: 'आयु',
        gender: 'लिंग',
        bloodGroup: 'रक्त समूह',
        phone: 'फोन नंबर',
        email: 'ईमेल पता',
        address: 'पता',
        city: 'शहर',
        state: 'राज्य',
        pincode: 'पिन कोड',
        weight: 'वजन (किग्रा)',
        healthStatus: 'स्वास्थ्य स्थिति',
        lastDonation: 'पिछली बार रक्तदान की तारीख',
        emergencyContact: 'आपातकालीन संपर्क का नाम',
        emergencyPhone: 'आपातकालीन संपर्क फोन',
        photo: 'प्रोफाइल फोटो'
      },
      options: {
        male: 'पुरुष',
        female: 'महिला',
        other: 'अन्य',
        healthConfirm: 'मैं पुष्टि करता हूं कि मैं अच्छे स्वास्थ्य में हूं और रक्तदान के लिए योग्य हूं'
      },
      buttons: {
        next: 'अगला चरण',
        previous: 'पिछला',
        submit: 'दाता के रूप में पंजीकरण करें',
        uploadPhoto: 'फोटो अपलोड करें'
      },
      validation: {
        nameRequired: 'पूरा नाम आवश्यक है',
        ageRequired: 'आयु आवश्यक है',
        ageInvalid: 'आयु 18 और 65 के बीच होनी चाहिए',
        phoneRequired: 'फोन नंबर आवश्यक है',
        phoneInvalid: 'कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें',
        emailRequired: 'ईमेल आवश्यक है',
        emailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें',
        weightRequired: 'वजन आवश्यक है',
        weightInvalid: 'वजन कम से कम 50 किग्रा होना चाहिए'
      },
      eligibility: {
        title: 'दाता पात्रता',
        criteria: [
          '18-65 वर्ष के बीच आयु',
          'कम से कम 50 किग्रा वजन',
          'अच्छा सामान्य स्वास्थ्य',
          'हाल ही में कोई टैटू या छेदन नहीं',
          'पिछला रक्तदान 3+ महीने पहले था'
        ]
      },
      benefits: {
        title: 'दाता लाभ',
        list: [
          'मुफ्त स्वास्थ्य जांच',
          'रक्त समूह प्रमाणपत्र',
          'दाता पहचान पत्र',
          'आपातकाल में प्राथमिकता',
          'सामुदायिक मान्यता'
        ]
      },
      success: 'पंजीकरण सफल! LifeLink समुदाय में आपका स्वागत है।',
      loginPrompt: 'दाता के रूप में पंजीकरण करने के लिए कृपया लॉगिन करें।'
    }
  };

  const t = translations[language];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const validateStep = (step: number) => {
    const newErrors: any = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = t.validation.nameRequired;
      if (!formData.age) newErrors.age = t.validation.ageRequired;
      else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
        newErrors.age = t.validation.ageInvalid;
      }
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    }

    if (step === 2) {
      if (!formData.weight) newErrors.weight = t.validation.weightRequired;
      if (!formData.healthStatus || formData.healthStatus.length === 0) {
        newErrors.healthStatus = language === 'en' ? 'Please confirm your health status to proceed' : 'आगे बढ़ने के लिए कृपया अपनी स्वास्थ्य स्थिति की पुष्टि करें';
      }
    }

    if (step === 3) {
      if (!formData.phone) newErrors.phone = t.validation.phoneRequired;
      else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = t.validation.phoneInvalid;
      }
      if (!formData.email) newErrors.email = t.validation.emailRequired;
      else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t.validation.emailInvalid;
      }
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.emergencyContact) newErrors.emergencyContact = language === 'en' ? 'Emergency contact name is required' : 'आपातकालीन संपर्क का नाम आवश्यक है';
      if (!formData.emergencyPhone) {
        newErrors.emergencyPhone = language === 'en' ? 'Emergency contact phone is required' : 'आपातकालीन संपर्क फोन आवश्यक है';
      } else if (!/^\d{10}$/.test(formData.emergencyPhone)) {
        newErrors.emergencyPhone = language === 'en' ? 'Please enter a valid 10-digit phone number' : 'कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें';
      } else if (formData.phone === formData.emergencyPhone) {
        newErrors.emergencyPhone = language === 'en' ? 'Emergency contact phone must be different from your phone number' : 'आपातकालीन संपर्क फोन आपके फोन नंबर से अलग होना चाहिए';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Save donor registration to localStorage
      const donorData = {
        ...formData,
        id: Date.now(),
        userId: user.id,
        registeredAt: new Date().toISOString(),
        status: 'active'
      };
      
      const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
      existingDonors.push(donorData);
      localStorage.setItem('donors', JSON.stringify(existingDonors));

      // Check for matching blood requests
      const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      const compatibleRequests = getCompatibleRequests(formData.bloodGroup, bloodRequests);
      
      // Save notifications for this donor
      if (compatibleRequests.length > 0) {
        const notifications = compatibleRequests.map(request => ({
          id: Date.now() + Math.random(),
          donorId: donorData.id,
          requestId: request.id,
          message: `Urgent: ${request.bloodGroup} blood needed for ${request.patientName} at ${request.hospital}`,
          type: 'blood_request',
          urgency: request.urgencyLevel,
          createdAt: new Date().toISOString(),
          read: false
        }));
        
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        existingNotifications.push(...notifications);
        localStorage.setItem('notifications', JSON.stringify(existingNotifications));
      }

      setSuccessMessage(t.success);
      setCurrentStep(5); // Show notifications step
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getCompatibleRequests = (donorBloodGroup: string, requests: any[]) => {
    const compatibility = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };
    
    const compatibleGroups = compatibility[donorBloodGroup] || [];
    return requests.filter(request => 
      compatibleGroups.includes(request.bloodGroup) && 
      request.status === 'active'
    ).slice(0, 3); // Show top 3 matches
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">{t.loginPrompt}</p>
            <Button onClick={() => navigate('/auth')} className="bg-red-600 hover:bg-red-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (successMessage && currentStep === 5) {
    const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    const compatibleRequests = getCompatibleRequests(formData.bloodGroup, bloodRequests);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8"
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.success}</h2>
            <p className="text-gray-600 mb-6">Welcome to the LifeLink community!</p>
          </motion.div>

          {compatibleRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-red-600 mb-2 flex items-center justify-center">
                  <Heart className="h-6 w-6 mr-2 animate-pulse" />
                  Urgent Blood Requests ({formData.bloodGroup})
                </h3>
                <p className="text-gray-600">
                  Great news! There are {compatibleRequests.length} urgent requests matching your blood group.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compatibleRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                  >
                    <Card className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      request.urgencyLevel === 'critical' ? 'border-red-500 bg-red-50' :
                      request.urgencyLevel === 'high' ? 'border-orange-400 bg-orange-50' :
                      'border-red-200 bg-white'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${
                            request.urgencyLevel === 'critical' ? 'bg-red-600' :
                            request.urgencyLevel === 'high' ? 'bg-orange-500' :
                            request.urgencyLevel === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          } text-white animate-pulse`}>
                            {request.urgencyLevel?.toUpperCase()}
                          </Badge>
                          <div className="text-right">
                            <div className="font-bold text-red-600 text-2xl">{request.bloodGroup}</div>
                            <div className="text-xs text-gray-500">{request.unitsNeeded} unit(s)</div>
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {request.patientName}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-3 w-3 mr-2 text-red-400" />
                            <span className="font-medium">{request.hospital}</span>
                          </div>
                          <div className="text-gray-500 text-xs ml-5">
                            {request.city}, {request.state}
                          </div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                            <span>Needed: {new Date(request.dateNeeded || request.createdAt).toLocaleDateString()}</span>
                          </div>
                          {request.medicalCondition && (
                            <div className="flex items-center text-gray-600 text-xs">
                              <Heart className="h-3 w-3 mr-2 text-pink-400" />
                              <span className="truncate">{request.medicalCondition}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            size="sm" 
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => window.open(`tel:${request.phone}`)}
                          >
                            <Phone className="h-3 w-3 mr-2" />
                            Call Now
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              const message = `Hi, I'm a registered blood donor with ${formData.bloodGroup} blood group. I saw your urgent request for ${request.patientName} and I'm available to help.`;
                              window.open(`sms:${request.phone}?body=${encodeURIComponent(message)}`);
                            }}
                          >
                            Send SMS
                          </Button>
                        </div>
                        
                        {request.urgencyLevel === 'critical' && (
                          <div className="mt-3 text-xs text-red-600 font-medium flex items-center justify-center bg-red-100 p-2 rounded">
                            <div className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                            Time Critical
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: compatibleRequests.length > 0 ? 1.5 : 0.8 }}
            className="text-center"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                🎉 Welcome to LifeLink Community!
              </h3>
              <p className="text-blue-800 mb-4">
                You are now registered as a blood donor. You will receive notifications in the <strong>Alerts</strong> button when:
              </p>
              <div className="text-left max-w-md mx-auto space-y-2 text-blue-700">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <span>Someone nearby needs your blood group</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                  <span>Critical emergency requests in your area</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                  <span>Hospital blood bank shortages</span>
                </div>
              </div>
              <p className="text-blue-600 text-sm mt-4 font-medium">
                💡 Check the Alerts button regularly to help save lives!
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-red-600 hover:bg-red-700 px-8 py-3"
            >
              Go to Dashboard
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              {compatibleRequests.length > 0 
                ? 'You can also view these requests later in your dashboard notifications.'
                : 'You will be notified when there are blood requests matching your blood group.'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t.fields.fullName} *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <Label htmlFor="age">{t.fields.age} *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender" className="block mb-2">{t.fields.gender} *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">{t.options.male}</option>
                  <option value="female">{t.options.female}</option>
                  <option value="other">{t.options.other}</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              
              <div>
                <Label htmlFor="bloodGroup" className="block mb-2">{t.fields.bloodGroup} *</Label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight" className="block mb-2">{t.fields.weight} *</Label>
                <select
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Weight Range</option>
                  <option value="50-60">50-60 kg</option>
                  <option value="60-70">60-70 kg</option>
                  <option value="70-80">70-80 kg</option>
                  <option value="80-90">80-90 kg</option>
                  <option value="above-90">Above 90 kg</option>
                </select>
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastDonation" className="block mb-2">{t.fields.lastDonation} (Optional)</Label>
                <Input
                  id="lastDonation"
                  name="lastDonation"
                  type="date"
                  value={formData.lastDonation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label className="block mb-3 text-lg font-medium">{t.fields.healthStatus} ⚕️</Label>
              <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="healthConfirm"
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        healthStatus: isChecked ? ['confirmed'] : []
                      }));
                      // Clear health status error when checked
                      if (isChecked && errors.healthStatus) {
                        setErrors(prev => ({ ...prev, healthStatus: '' }));
                      }
                    }}
                  />
                  <label htmlFor="healthConfirm" className="text-sm text-gray-700 leading-5">
                    {t.options.healthConfirm}
                  </label>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  ✓ No recent illness or fever<br/>
                  ✓ No medications that affect blood donation<br/>
                  ✓ No recent tattoos or piercings (within 6 months)
                </div>
              </div>
              {errors.healthStatus && <p className="text-red-500 text-sm mt-2">{errors.healthStatus}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="block mb-2">{t.fields.phone} *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'border-red-500' : ''}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="email" className="block mb-2">{t.fields.email} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="block mb-2">{t.fields.address}</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="block mb-2">{t.fields.city} *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <Label htmlFor="state" className="block mb-2">{t.fields.state} *</Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <Label htmlFor="pincode" className="block mb-2">{t.fields.pincode}</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="number"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit PIN"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact" className="block mb-2">{t.fields.emergencyContact} *</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className={errors.emergencyContact ? 'border-red-500' : ''}
                />
                {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
              </div>
              
              <div>
                <Label htmlFor="emergencyPhone" className="block mb-2">{t.fields.emergencyPhone} *</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className={errors.emergencyPhone ? 'border-red-500' : ''}
                  placeholder="10-digit mobile number"
                />
                {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Information</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">{t.fields.fullName}:</span>
                  <span className="ml-2">{formData.fullName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.age}:</span>
                  <span className="ml-2">{formData.age} years</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.bloodGroup}:</span>
                  <Badge variant="destructive" className="ml-2">{formData.bloodGroup}</Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.weight}:</span>
                  <span className="ml-2">{formData.weight} kg</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.phone}:</span>
                  <span className="ml-2">{formData.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.city}:</span>
                  <span className="ml-2">{formData.city}, {formData.state}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.emergencyContact}:</span>
                  <span className="ml-2">{formData.emergencyContact}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t.fields.emergencyPhone}:</span>
                  <span className="ml-2">{formData.emergencyPhone}</span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  step <= currentStep ? 'bg-red-500' : 'bg-gray-300'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${step < currentStep ? 'bg-red-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8 text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'text-red-600 font-medium' : ''}>{t.steps.personal}</span>
            <span className={currentStep >= 2 ? 'text-red-600 font-medium' : ''}>{t.steps.medical}</span>
            <span className={currentStep >= 3 ? 'text-red-600 font-medium' : ''}>{t.steps.contact}</span>
            <span className={currentStep >= 4 ? 'text-red-600 font-medium' : ''}>{t.steps.review}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={currentStep}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    Step {currentStep}: {Object.values(t.steps)[currentStep - 1]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderStep()}
                  
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        {t.buttons.previous}
                      </Button>
                    )}
                    
                    <div className="ml-auto">
                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t.buttons.next}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Registering...</span>
                            </div>
                          ) : (
                            t.buttons.submit
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {t.eligibility.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.eligibility.criteria.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  {t.benefits.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.benefits.list.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Heart className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}