import React, { useState, useEffect } from 'react';
import { Star, Heart, Award, Send, CheckCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FeedbackPageProps {
  language: string;
}

export function FeedbackPage({ language }: FeedbackPageProps) {
  const [activeTab, setActiveTab] = useState('testimonials');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    donorType: 'donor',
    rating: 5,
    title: '',
    story: '',
    type: 'testimonial',
    anonymous: false
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b1fb2c61/feedback/success-stories`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const translations = {
    en: {
      title: 'Community Feedback & Stories',
      subtitle: 'Share your experience and read inspiring stories from our community',
      tabs: {
        testimonials: 'Success Stories',
        submit: 'Share Your Story',
        ratings: 'Platform Ratings'
      },
      form: {
        name: 'Your Name',
        email: 'Email Address',
        donorType: 'I am a',
        rating: 'Rate Your Experience',
        title: 'Story Title',
        story: 'Your Story',
        type: 'Feedback Type',
        anonymous: 'Submit Anonymously',
        submit: 'Share Story'
      },
      types: {
        testimonial: 'Success Story',
        feedback: 'General Feedback',
        suggestion: 'Suggestion',
        complaint: 'Complaint'
      },
      donorTypes: {
        donor: 'Blood Donor',
        recipient: 'Blood Recipient',
        family: 'Family Member',
        volunteer: 'Volunteer',
        medical: 'Medical Professional'
      },
      stories: {
        noStories: 'No stories shared yet. Be the first to share your experience!',
        readMore: 'Read More',
        verified: 'Verified Story'
      },
      success: 'Thank you for sharing your story! It will inspire others to join our mission.',
      validation: {
        nameRequired: 'Name is required (unless anonymous)',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        titleRequired: 'Story title is required',
        storyRequired: 'Please share your story'
      },
      ratings: {
        title: 'Platform Ratings',
        overall: 'Overall Rating',
        userFriendly: 'User Friendly',
        response: 'Response Time',
        support: 'Customer Support',
        recommend: 'Would Recommend'
      },
      impact: {
        title: 'Community Impact',
        stories: 'Stories Shared',
        helped: 'People Helped',
        satisfaction: 'Satisfaction Rate',
        response: 'Avg Response Time'
      }
    },
    hi: {
      title: 'समुदायिक फीडबैक और कहानियां',
      subtitle: 'अपना अनुभव साझा करें और हमारे समुदाय की प्रेरणादायक कहानियां पढ़ें',
      tabs: {
        testimonials: 'सफलता की कहानियां',
        submit: 'अपनी कहानी साझा करें',
        ratings: 'प्लेटफॉर्म रेटिंग'
      },
      form: {
        name: 'आपका नाम',
        email: 'ईमेल पता',
        donorType: 'मैं हूं',
        rating: 'अपने अनुभव को रेट करें',
        title: 'कहानी का शीर्षक',
        story: 'आपकी कहानी',
        type: 'फीडबैक प्रकार',
        anonymous: 'गुमनाम रूप से सबमिट करें',
        submit: 'कहानी साझा करें'
      },
      types: {
        testimonial: 'सफलता की कहानी',
        feedback: 'सामान्य फीडबैक',
        suggestion: 'सुझाव',
        complaint: 'शिकायत'
      },
      donorTypes: {
        donor: 'रक्तदाता',
        recipient: 'रक्त प्राप्तकर्ता',
        family: 'पारिवारिक सदस्य',
        volunteer: 'स्वयंसेवक',
        medical: 'चिकित्सा पेशेवर'
      },
      stories: {
        noStories: 'अभी तक कोई कहानी साझा नहीं की गई। अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!',
        readMore: 'और पढ़ें',
        verified: 'सत्यापित कहानी'
      },
      success: 'आपकी कहानी साझा करने के लिए धन्यवाद! यह दूसरों को हमारे मिशन में शामिल होने के लिए प्रेरित करेगी।',
      validation: {
        nameRequired: 'नाम आवश्यक है (जब तक कि गुमनाम न हो)',
        emailRequired: 'ईमेल आवश्यक है',
        emailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें',
        titleRequired: 'कहानी का शीर्षक आवश्यक है',
        storyRequired: 'कृपया अपनी कहानी साझा करें'
      },
      ratings: {
        title: 'प्लेटफॉर्म रेटिंग',
        overall: 'समग्र रेटिंग',
        userFriendly: 'उपयोगकर्ता के अनुकूल',
        response: 'प्रतिक्रिया समय',
        support: 'ग्राहक सहायता',
        recommend: 'सिफारिश करेंगे'
      },
      impact: {
        title: 'सामुदायिक प्रभाव',
        stories: 'साझा की गई कहानियां',
        helped: 'लोगों की मदद की',
        satisfaction: 'संतुष्टि दर',
        response: 'औसत प्रतिक्रिया समय'
      }
    }
  };

  const t = translations[language];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.anonymous && !formData.name.trim()) {
      newErrors.name = t.validation.nameRequired;
    }
    if (!formData.email.trim()) newErrors.email = t.validation.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.validation.emailInvalid;
    }
    if (!formData.title.trim()) newErrors.title = t.validation.titleRequired;
    if (!formData.story.trim()) newErrors.story = t.validation.storyRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b1fb2c61/feedback/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          donorName: formData.anonymous ? 'Anonymous' : formData.name,
          type: 'success_story'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit feedback');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        donorType: 'donor',
        rating: 5,
        title: '',
        story: '',
        type: 'testimonial',
        anonymous: false
      });
      
      // Refresh testimonials
      fetchTestimonials();
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    );
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">{t.success}</p>
          <Button 
            onClick={() => { setSubmitSuccess(false); setActiveTab('testimonials'); }} 
            className="bg-red-600 hover:bg-red-700"
          >
            View All Stories
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
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-center justify-center">
                <Award className="h-6 w-6 text-red-500 mr-2" />
                {t.impact.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{testimonials.length}</div>
                  <div className="text-sm text-gray-600">{t.impact.stories}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">{t.impact.helped}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">4.8★</div>
                  <div className="text-sm text-gray-600">{t.impact.satisfaction}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">&lt; 5 min</div>
                  <div className="text-sm text-gray-600">{t.impact.response}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center space-x-1 bg-white rounded-lg p-1 max-w-md mx-auto">
            {Object.entries(t.tabs).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-12 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t.stories.noStories}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              testimonials.map((story: any, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-8 w-8 text-red-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {story.donorName || 'Anonymous'}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {renderStars(story.rating || 5)}
                              <Badge variant="secondary" className="text-xs">
                                {t.stories.verified}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-3">
                        {story.title || 'Untitled Story'}
                      </h4>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {story.story?.length > 150 
                          ? `${story.story.substring(0, 150)}...` 
                          : story.story}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                        {story.story?.length > 150 && (
                          <button className="text-red-600 hover:text-red-700">
                            {t.stories.readMore}
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 text-red-500 mr-2" />
                  Share Your Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        {t.form.name} {!formData.anonymous && '*'}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={formData.anonymous}
                        className={errors.name ? 'border-red-500' : ''}
                        placeholder={formData.anonymous ? 'Will be shown as Anonymous' : ''}
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
                      <Label htmlFor="donorType">{t.form.donorType}</Label>
                      <select
                        id="donorType"
                        name="donorType"
                        value={formData.donorType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {Object.entries(t.donorTypes).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
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
                        {Object.entries(t.types).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>{t.form.rating}</Label>
                    <div className="mt-2">
                      {renderStars(formData.rating, true)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">{t.form.title} *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={errors.title ? 'border-red-500' : ''}
                      placeholder="Give your story a meaningful title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="story">{t.form.story} *</Label>
                    <textarea
                      id="story"
                      name="story"
                      rows={6}
                      value={formData.story}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.story ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Share your experience, how blood donation or receiving blood impacted your life..."
                    />
                    {errors.story && <p className="text-red-500 text-sm mt-1">{errors.story}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      {t.form.anonymous}
                    </Label>
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
                        <span>Sharing...</span>
                      </div>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        {t.form.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 text-red-500 mr-2" />
                  {t.ratings.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.ratings.overall}</span>
                      <div className="flex items-center space-x-2">
                        {renderStars(5)}
                        <span className="text-lg font-bold">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.ratings.userFriendly}</span>
                      <div className="flex items-center space-x-2">
                        {renderStars(5)}
                        <span className="text-lg font-bold">4.9</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.ratings.response}</span>
                      <div className="flex items-center space-x-2">
                        {renderStars(4)}
                        <span className="text-lg font-bold">4.6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.ratings.support}</span>
                      <div className="flex items-center space-x-2">
                        {renderStars(5)}
                        <span className="text-lg font-bold">4.9</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.ratings.recommend}</span>
                      <div className="flex items-center space-x-2">
                        {renderStars(5)}
                        <span className="text-lg font-bold">4.8</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-8">
                      <div className="text-4xl font-bold text-red-600 mb-2">95%</div>
                      <div className="text-gray-600">of users would recommend LifeLink</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}