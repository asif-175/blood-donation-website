import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ContactPageProps {
  language: string;
}

export function ContactPage({ language }: ContactPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [errors, setErrors] = useState<any>({});

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our support team',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Message',
        type: 'Inquiry Type',
        submit: 'Send Message'
      },
      types: {
        general: 'General Inquiry',
        emergency: 'Emergency Support',
        technical: 'Technical Support',
        donation: 'Donation Related',
        feedback: 'Feedback/Suggestions'
      },
      contact: {
        title: 'Contact Information',
        emergency: 'Emergency Helpline',
        support: 'Support Email',
        address: 'Office Address',
        hours: 'Business Hours'
      },
      office: {
        address: '123 LifeLink Street, Medical District, City 12345',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Emergency Only'
      },
      success: 'Your message has been sent successfully! We will get back to you within 24 hours.',
      validation: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        subjectRequired: 'Subject is required',
        messageRequired: 'Message is required'
      },
      emergency: {
        title: 'Emergency Blood Request?',
        subtitle: 'For immediate blood requirements, please use our emergency services',
        call: 'Call Emergency Helpline',
        request: 'Submit Emergency Request'
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          {
            q: 'How quickly can I get help in an emergency?',
            a: 'Our emergency helpline operates 24/7. Blood requests are processed within minutes and nearby donors are notified immediately.'
          },
          {
            q: 'Is my personal information secure?',
            a: 'Yes, we use industry-standard encryption and security measures to protect all personal and medical information.'
          },
          {
            q: 'How do I become a verified donor?',
            a: 'Complete our donor registration form with medical screening. Verification typically takes 24-48 hours.'
          },
          {
            q: 'Can I donate if I have medical conditions?',
            a: 'It depends on your specific condition. Please consult with our medical team during the screening process.'
          }
        ]
      }
    },
    hi: {
      title: 'हमसे संपर्क करें',
      subtitle: 'हमारी सहायता टीम से संपर्क करें',
      form: {
        name: 'पूरा नाम',
        email: 'ईमेल पता',
        phone: 'फोन नंबर',
        subject: 'विषय',
        message: 'संदेश',
        type: 'पूछताछ का प्रकार',
        submit: 'संदेश भेजें'
      },
      types: {
        general: 'सामान्य पूछताछ',
        emergency: 'आपातकालीन सहायता',
        technical: 'तकनीकी सहायता',
        donation: 'दान संबंधित',
        feedback: 'फीडबैक/सुझाव'
      },
      contact: {
        title: 'संपर्क जानकारी',
        emergency: 'आपातकालीन हेल्पलाइन',
        support: 'सहायता ईमेल',
        address: 'कार्यालय पता',
        hours: 'कार्यालय समय'
      },
      office: {
        address: '123 LifeLink स्ट्रीट, मेडिकल डिस्ट्रिक्ट, शहर 12345',
        hours: 'सोमवार - शुक्रवार: सुबह 9:00 - शाम 6:00\nशनिवार: सुबह 9:00 - दोपहर 2:00\nरविवार: केवल आपातकाल'
      },
      success: 'आपका संदेश सफलतापूर्वक भेजा गया है! हम 24 घंटे के भीतर आपसे संपर्क करेंगे।',
      validation: {
        nameRequired: 'नाम आवश्यक है',
        emailRequired: 'ईमेल आवश्यक है',
        emailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें',
        subjectRequired: 'विषय आवश्यक है',
        messageRequired: 'संदेश आवश्यक है'
      },
      emergency: {
        title: 'आपातकालीन रक्त की आवश्यकता?',
        subtitle: 'तत्काल रक्त आवश्यकताओं के लिए, कृपया हमारी आपातकालीन सेवाओं का उपयोग करें',
        call: 'आपातकालीन हेल्पलाइन कॉल करें',
        request: 'आपातकालीन अनुरोध सबमिट करें'
      },
      faq: {
        title: 'अक्सर पूछे जाने वाले प्रश्न',
        questions: [
          {
            q: 'आपातकाल में मुझे कितनी जल्दी मदद मिल सकती है?',
            a: 'हमारी आपातकालीन हेल्पलाइन 24/7 काम करती है। रक्त अनुरोध मिनटों में संसाधित होते हैं और आस-पास के दाताओं को तुरंत सूचित किया जाता है।'
          },
          {
            q: 'क्या मेरी व्यक्तिगत जानकारी सुरक्षित है?',
            a: 'हाँ, हम सभी व्यक्तिगत और चिकित्सा जानकारी की सुरक्षा के लिए उद्योग-मानक एन्क्रिप्शन और सुरक्षा उपायों का उपयोग करते हैं।'
          },
          {
            q: 'मैं सत्यापित दाता कैसे बनूं?',
            a: 'चिकित्सा जांच के साथ हमारा दाता पंजीकरण फॉर्म पूरा करें। सत्यापन में आमतौर पर 24-48 घंटे लगते हैं।'
          },
          {
            q: 'क्या मैं चिकित्सा स्थितियों के साथ दान कर सकता हूं?',
            a: 'यह आपकी विशिष्ट स्थिति पर निर्भर करता है। कृपया स्क्रीनिंग प्रक्रिया के दौरान हमारी चिकित्सा टीम से सलाह लें।'
          }
        ]
      }
    }
  };

  const t = translations[language];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = t.validation.nameRequired;
    if (!formData.email.trim()) newErrors.email = t.validation.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.validation.emailInvalid;
    if (!formData.subject.trim()) newErrors.subject = t.validation.subjectRequired;
    if (!formData.message.trim()) newErrors.message = t.validation.messageRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b1fb2c61/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general'
      });
      
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

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">{t.success}</p>
          <Button onClick={() => setSubmitSuccess(false)} className="bg-red-600 hover:bg-red-700">
            Send Another Message
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
          <Mail className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </motion.div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 text-red-500 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.form.name} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">{t.form.email} *</Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{t.form.phone}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">{t.form.type}</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="general">{t.types.general}</option>
                        <option value="emergency">{t.types.emergency}</option>
                        <option value="technical">{t.types.technical}</option>
                        <option value="donation">{t.types.donation}</option>
                        <option value="feedback">{t.types.feedback}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">{t.form.subject} *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={errors.subject ? 'border-red-500' : ''}
                      placeholder="Brief description of your inquiry"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message">{t.form.message} *</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Please provide detailed information about your inquiry..."
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {t.form.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & FAQ */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  {t.contact.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{t.contact.emergency}</h4>
                    <p className="text-gray-600">911 (24/7)</p>
                    <p className="text-sm text-gray-500">For immediate blood emergencies</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{t.contact.support}</h4>
                    <p className="text-gray-600">support@lifelink.org</p>
                    <p className="text-sm text-gray-500">General inquiries and support</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{t.contact.address}</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{t.office.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{t.contact.hours}</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{t.office.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-red-500 mr-2" />
                  {t.faq.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {t.faq.questions.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{faq.q}</h4>
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}