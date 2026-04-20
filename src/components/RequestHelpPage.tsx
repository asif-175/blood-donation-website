import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, User, Heart, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RequestHelpPageProps {
  language: string;
  user: any;
}

export function RequestHelpPage({ language, user }: RequestHelpPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    bloodGroup: '',
    unitsNeeded: '1',
    hospital: '',
    doctorName: '',
    contactPerson: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    urgencyLevel: 'high',
    medicalCondition: '',
    dateNeeded: '',
    additionalNotes: '',
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchUrgentRequests();
  }, []);

  const fetchUrgentRequests = async () => {
    try {
      const savedRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      // Show only recent urgent requests (last 7 days)
      const recentRequests = savedRequests.filter((req: any) => {
        const requestDate = new Date(req.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return requestDate > weekAgo;
      });
      setUrgentRequests(recentRequests);
    } catch (error) {
      console.error('Error fetching urgent requests:', error);
    }
  };

  const translations = {
    en: {
      title: 'Request Emergency Blood Help',
      subtitle: 'Get immediate assistance for blood requirements',
      form: {
        patientInfo: 'Patient Information',
        patientName: 'Patient Name',
        age: 'Age',
        bloodGroup: 'Blood Group Required',
        unitsNeeded: 'Units Needed',
        medicalCondition: 'Medical Condition',
        hospitalInfo: 'Hospital Information',
        hospital: 'Hospital Name',
        doctorName: 'Doctor Name',
        address: 'Hospital Address',
        city: 'City',
        state: 'State',
        contactInfo: 'Contact Information',
        contactPerson: 'Contact Person',
        phone: 'Primary Phone',
        alternatePhone: 'Alternate Phone',
        urgencyInfo: 'Urgency Information',
        urgencyLevel: 'Urgency Level',
        dateNeeded: 'Date Needed',
        additionalNotes: 'Additional Notes',
        submit: 'Submit Request'
      },
      urgency: {
        critical: 'Critical (Within 1 hour)',
        high: 'High (Within 6 hours)',
        medium: 'Medium (Within 24 hours)',
        low: 'Low (Within 3 days)'
      },
      currentRequests: 'Current Urgent Requests',
      noRequests: 'No urgent requests at the moment',
      helpNow: 'Help Now',
      contact: 'Contact',
      success: 'Your request has been submitted successfully! Nearby donors will be notified.',
      guidelines: {
        title: 'Important Guidelines',
        points: [
          'Ensure all information is accurate',
          'Have hospital verification ready',
          'Keep your phone available for donor calls',
          'Be prepared to provide medical documents',
          'Follow up with hospital blood bank'
        ]
      },
      validation: {
        patientNameRequired: 'Patient name is required',
        ageRequired: 'Age is required',
        bloodGroupRequired: 'Blood group is required',
        hospitalRequired: 'Hospital name is required',
        contactPersonRequired: 'Contact person is required',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid 10-digit phone number',
        alternatePhoneRequired: 'Alternate phone number is required',
        alternatePhoneInvalid: 'Please enter a valid 10-digit alternate phone number',
        cityRequired: 'City is required',
        dateRequired: 'Date needed is required'
      }
    },
    hi: {
      title: 'आपातकालीन रक्त सहायता का अनुरोध करें',
      subtitle: 'रक्त आवश्यकताओं के लिए तत्काल सहायता प्राप्त करें',
      form: {
        patientInfo: 'रोगी की जानकारी',
        patientName: 'रोगी का नाम',
        age: 'आयु',
        bloodGroup: 'आवश्यक रक्त समूह',
        unitsNeeded: 'आवश्यक यूनिट',
        medicalCondition: 'चिकित्सा स्थिति',
        hospitalInfo: 'अस्पताल की जानकारी',
        hospital: 'अस्पताल का नाम',
        doctorName: 'डॉक्टर का नाम',
        address: 'अस्पताल का पता',
        city: 'शहर',
        state: 'राज्य',
        contactInfo: 'संपर्क जानकारी',
        contactPerson: 'संपर्क व्यक्ति',
        phone: 'मुख्य फोन',
        alternatePhone: 'वैकल्पिक फोन',
        urgencyInfo: 'तात्कालिकता की जानकारी',
        urgencyLevel: 'तात्कालिकता का स्तर',
        dateNeeded: 'आवश्यक तिथि',
        additionalNotes: 'अतिरिक्त नोट्स',
        submit: 'अनुरोध सबमिट करें'
      },
      urgency: {
        critical: 'गंभीर (1 घंटे के भीतर)',
        high: 'उच्च (6 घंटे के भीतर)',
        medium: 'मध्यम (24 घंटे के भीतर)',
        low: 'कम (3 दिन के भीतर)'
      },
      currentRequests: 'वर्तमान तत्काल अनुरोध',
      noRequests: 'फिलहाल कोई तत्काल अनुरोध नहीं',
      helpNow: 'अभी मदद करें',
      contact: 'संपर्क करें',
      success: 'आपका अनुरोध सफलतापूर्वक सबमिट हो गया है! पास के दाताओं को सूचित किया जाएगा।',
      guidelines: {
        title: 'महत्वपूर्ण दिशानिर्देश',
        points: [
          'सुनिश्चित करें कि सभी जानकारी सटीक है',
          'अस्पताल सत्यापन तैयार रखें',
          'दाता कॉल के लिए अपना फोन उपलब्ध रखें',
          'चिकित्सा दस्तावेज प्रदान करने के लिए तैयार रहें',
          'अस्पताल रक्त बैंक के साथ फॉलो अप करें'
        ]
      },
      validation: {
        patientNameRequired: 'रोगी का नाम आवश्यक है',
        ageRequired: 'आयु आवश्यक है',
        bloodGroupRequired: 'रक्त समूह आवश्यक है',
        hospitalRequired: 'अस्पताल का नाम आवश्यक है',
        contactPersonRequired: 'संपर्क व्यक्ति आवश्यक है',
        phoneRequired: 'फोन नंबर आवश्यक है',
        phoneInvalid: 'कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें',
        alternatePhoneRequired: 'वैकल्पिक फोन नंबर आवश्यक है',
        alternatePhoneInvalid: 'कृपया एक वैध 10-अंकीय वैकल्पिक फोन नंबर दर्ज करें',
        cityRequired: 'शहर आवश्यक है',
        dateRequired: 'आवश्यक तिथि आवश्यक है'
      }
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

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.patientName.trim()) newErrors.patientName = t.validation.patientNameRequired;

    if (!formData.bloodGroup) newErrors.bloodGroup = t.validation.bloodGroupRequired;
    if (!formData.hospital.trim()) newErrors.hospital = t.validation.hospitalRequired;
    if (!formData.contactPerson.trim()) newErrors.contactPerson = t.validation.contactPersonRequired;
    if (!formData.phone) newErrors.phone = t.validation.phoneRequired;
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = t.validation.phoneInvalid;
    if (!formData.alternatePhone) newErrors.alternatePhone = 'Alternate phone number is required';
    else if (!/^\d{10}$/.test(formData.alternatePhone)) newErrors.alternatePhone = 'Please enter a valid 10-digit alternate phone number';
    else if (formData.phone === formData.alternatePhone) newErrors.alternatePhone = 'Alternate phone must be different from primary phone';
    if (!formData.city.trim()) newErrors.city = t.validation.cityRequired;
    if (!formData.dateNeeded) newErrors.dateNeeded = t.validation.dateRequired;
    if (!formData.urgencyLevel) newErrors.urgencyLevel = 'Urgency level is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Save request to localStorage
      const newRequest = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'active',
        userId: user?.id || null
      };
      
      const savedRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      savedRequests.push(newRequest);
      localStorage.setItem('bloodRequests', JSON.stringify(savedRequests));

      setSubmitSuccess(true);
      setFormData({
        patientName: '',
        age: '',
        bloodGroup: '',
        unitsNeeded: '1',
        hospital: '',
        doctorName: '',
        contactPerson: '',
        phone: '',
        alternatePhone: '',
        address: '',
        city: '',
        state: '',
        urgencyLevel: '',
        medicalCondition: '',
        dateNeeded: '',
        additionalNotes: '',
        latitude: '',
        longitude: ''
      });
      
      // Refresh urgent requests
      fetchUrgentRequests();
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">{t.success}</p>
          <Button onClick={() => setSubmitSuccess(false)} className="bg-red-600 hover:bg-red-700">
            Submit Another Request
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{t.subtitle}</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-red-400" />
              <span>24/7 Emergency Support</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-red-400" />
              <span>Instant Donor Notification</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-red-400" />
              <span>Location-Based Matching</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl border-red-100">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      Emergency Blood Request Form
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      Priority Request
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    Fill out this form to request emergency blood assistance. All fields marked with * are required.
                  </p>
                </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Patient Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.form.patientInfo}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientName">{t.form.patientName} *</Label>
                        <Input
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.patientName ? 'border-red-500' : ''}`}
                        />
                        {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="age">{t.form.age}</Label>
                        <select
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white"
                        >
                          <option value="">Select Age Range</option>
                          <option value="Below 10">Below 10</option>
                          <option value="10-20">10-20</option>
                          <option value="20-30">20-30</option>
                          <option value="30-40">30-40</option>
                          <option value="40-50">40-50</option>
                          <option value="50-60">50-60</option>
                          <option value="60-70">60-70</option>
                          <option value="70-80">70-80</option>
                          <option value="80-90">80-90</option>
                          <option value="Above 90">Above 90</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="bloodGroup">{t.form.bloodGroup} *</Label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className={`w-full mt-1 p-3 border rounded-md bg-white ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                        {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="unitsNeeded">{t.form.unitsNeeded}</Label>
                        <select
                          id="unitsNeeded"
                          name="unitsNeeded"
                          value={formData.unitsNeeded}
                          onChange={handleInputChange}
                          className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num} Unit{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label>{t.form.medicalCondition}</Label>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { name: 'Accident/Trauma', priority: 'Critical Priority' },
                          { name: 'Surgery/Operation', priority: 'High Priority' },
                          { name: 'Cancer Treatment', priority: 'High Priority' },
                          { name: 'Blood Disorder', priority: 'Medium Priority' },
                          { name: 'Pregnancy Complications', priority: 'Critical Priority' },
                          { name: 'Organ Transplant', priority: 'Critical Priority' },
                          { name: 'Chronic Disease', priority: 'Medium Priority' },
                          { name: 'Emergency Treatment', priority: 'Critical Priority' }
                        ].map((condition) => (
                          <div key={condition.name} className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                            formData.medicalCondition.includes(condition.name) 
                              ? 'border-red-500 bg-red-50 shadow-md' 
                              : 'border-gray-200 hover:border-red-300 hover:bg-gray-50 hover:shadow-sm'
                          }`}>
                            <label className="flex items-start space-x-3 cursor-pointer w-full">
                              <input
                                type="checkbox"
                                checked={formData.medicalCondition.includes(condition.name)}
                                onChange={(e) => {
                                  const conditions = formData.medicalCondition.split(', ').filter(c => c);
                                  if (e.target.checked) {
                                    conditions.push(condition.name);
                                  } else {
                                    const index = conditions.indexOf(condition.name);
                                    if (index > -1) conditions.splice(index, 1);
                                  }
                                  setFormData(prev => ({ ...prev, medicalCondition: conditions.join(', ') }));
                                }}
                                className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 mb-1">{condition.name}</div>
                                <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
                                  condition.priority === 'Critical Priority' ? 'bg-red-100 text-red-700' :
                                  condition.priority === 'High Priority' ? 'bg-orange-100 text-orange-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  <span className="mr-1">⚡</span>
                                  {condition.priority.split(' ')[0]} Priority
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hospital Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.form.hospitalInfo}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hospital">{t.form.hospital} *</Label>
                        <Input
                          id="hospital"
                          name="hospital"
                          value={formData.hospital}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.hospital ? 'border-red-500' : ''}`}
                        />
                        {errors.hospital && <p className="text-red-500 text-sm mt-1">{errors.hospital}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="doctorName">{t.form.doctorName}</Label>
                        <Input
                          id="doctorName"
                          name="doctorName"
                          value={formData.doctorName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">{t.form.address}</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Hospital address"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city">{t.form.city} *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="state">{t.form.state}</Label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    {/* GPS Location */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Hospital GPS Location (Optional)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    latitude: position.coords.latitude.toString(),
                                    longitude: position.coords.longitude.toString()
                                  }));
                                },
                                (error) => {
                                  alert('Unable to get location. Please enable location services.');
                                }
                              );
                            } else {
                              alert('Geolocation is not supported by this browser.');
                            }
                          }}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Current Location
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          placeholder="Latitude"
                          readOnly
                          className="mt-1"
                        />
                        <Input
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          placeholder="Longitude"
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      {formData.latitude && formData.longitude && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Hospital location captured successfully
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.form.contactInfo}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">{t.form.contactPerson} *</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.contactPerson ? 'border-red-500' : ''}`}
                        />
                        {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">{t.form.phone} *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="10-digit mobile number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="alternatePhone">{t.form.alternatePhone} *</Label>
                        <Input
                          id="alternatePhone"
                          name="alternatePhone"
                          type="tel"
                          value={formData.alternatePhone}
                          onChange={handleInputChange}
                          placeholder="Alternate contact number"
                          className={`mt-1 ${errors.alternatePhone ? 'border-red-500' : ''}`}
                        />
                        {errors.alternatePhone && <p className="text-red-500 text-sm mt-1">{errors.alternatePhone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Urgency Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.form.urgencyInfo}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="urgencyLevel">{t.form.urgencyLevel} *</Label>
                        <select
                          id="urgencyLevel"
                          name="urgencyLevel"
                          value={formData.urgencyLevel}
                          onChange={handleInputChange}
                          className={`w-full mt-1 p-3 border rounded-md bg-white ${errors.urgencyLevel ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select Urgency Level</option>
                          <option value="critical">{t.urgency.critical}</option>
                          <option value="high">{t.urgency.high}</option>
                          <option value="medium">{t.urgency.medium}</option>
                          <option value="low">{t.urgency.low}</option>
                        </select>
                        {errors.urgencyLevel && <p className="text-red-500 text-sm mt-1">{errors.urgencyLevel}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="dateNeeded">{t.form.dateNeeded} *</Label>
                        <Input
                          id="dateNeeded"
                          name="dateNeeded"
                          type="date"
                          value={formData.dateNeeded}
                          onChange={handleInputChange}
                          className={`mt-1 ${errors.dateNeeded ? 'border-red-500' : ''}`}
                        />
                        {errors.dateNeeded && <p className="text-red-500 text-sm mt-1">{errors.dateNeeded}</p>}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="additionalNotes">{t.form.additionalNotes}</Label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        rows={3}
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white"
                        placeholder="Any additional information that might help donors"
                      />
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-lg py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting Request...</span>
                      </div>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {t.form.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  {t.guidelines.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.guidelines.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Current Urgent Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 text-red-500 mr-2" />
                  {t.currentRequests}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {urgentRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">{t.noRequests}</p>
                ) : (
                  <div className="space-y-4">
                    {urgentRequests.slice(0, 5).map((request: any) => (
                      <div key={request.id} className="border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getUrgencyColor(request.urgencyLevel)} text-white`}>
                            {request.urgencyLevel?.toUpperCase()}
                          </Badge>
                          <span className="font-bold text-red-600 text-lg">
                            {request.bloodGroup}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {request.patientName}
                        </h4>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{request.hospital}, {request.city}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Phone number visible */}
                        <div className="flex items-center text-gray-700 text-sm font-medium mb-3">
                          <Phone className="h-3 w-3 mr-1 text-red-500" />
                          <span>{request.phone}</span>
                        </div>
                        <div className="flex space-x-2">
                          <a href={`tel:${request.phone}`} className="flex-1">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 w-full">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          </a>
                          <a
                            href={`https://wa.me/91${request.phone}?text=${encodeURIComponent(`🚨 Blood Required!\nPatient: ${request.patientName}\nBlood Group: ${request.bloodGroup}\nHospital: ${request.hospital}, ${request.city}\nUrgency: ${request.urgencyLevel?.toUpperCase()}\nContact: ${request.phone}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                              <span className="mr-1">📲</span>
                              WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}