import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, MapPin, Phone, Award, Bell, User, Edit, Settings, Droplets, Clock, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import type { Donor, Donation, BloodRequest, DonorResponse } from '../services/supabaseService';

interface DashboardProps {
  user: any;
  language: string;
}

function AcceptedRequests({ user, donor }: { user: any; donor: Donor | null }) {
  const [acceptedRequests, setAcceptedRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      if (!donor) {
        setLoading(false);
        return;
      }
      
      try {
        const responses = await supabaseService.getDonorResponses(donor.id);
        const acceptedResponses = responses.filter(r => r.response_type === 'accepted');
        
        const requests = await Promise.all(
          acceptedResponses.map(async (response) => {
            const allRequests = await supabaseService.getBloodRequests();
            return allRequests.find(req => req.id === response.request_id);
          })
        );
        
        setAcceptedRequests(requests.filter(Boolean) as BloodRequest[]);
      } catch (error) {
        console.error('Error fetching accepted requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequests();
  }, [donor]);

  if (loading) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            <span className="ml-2 text-green-700">Loading accepted requests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (acceptedRequests.length === 0) return null;

  return (
    <Card className="border-green-200 bg-green-50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center text-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          Accepted Donations ({acceptedRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {acceptedRequests.map((request: any) => (
            <div key={request.id} className="bg-white border border-green-200 rounded-lg p-3 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{request.patient_name}</h4>
                  <p className="text-xs text-gray-600">{request.hospital}</p>
                </div>
                <Badge className="bg-green-600 text-white text-xs">{request.blood_group}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {request.urgency_level} • {request.units_needed} units
                </div>
                <Button 
                  size="sm" 
                  className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(`tel:${request.phone}`)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard({ user, language }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>({
    donorProfile: null,
    donationHistory: [],
    urgentRequests: [],
    notifications: [],
    stats: {
      totalDonations: 0,
      livesImpacted: 0,
      lastDonation: null,
      nextEligible: null
    }
  });
  const [donorData, setDonorData] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Redirect admin users to admin dashboard
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Get donor profile
      const donorProfile = await supabaseService.getDonor(user.id);
      setDonorData(donorProfile);
      
      let userDonations: Donation[] = [];
      if (donorProfile) {
        userDonations = await supabaseService.getDonations(donorProfile.id);
      }
      
      // Get compatible blood requests
      const userBloodGroup = donorProfile?.blood_group || user.bloodGroup || 'O+';
      const compatibleRequests = await supabaseService.getCompatibleRequests(userBloodGroup, user.city);
      
      setDashboardData({
        donorProfile,
        donationHistory: userDonations,
        urgentRequests: compatibleRequests.slice(0, 3),
        notifications: [
          { id: 1, type: 'match', message: 'New blood request matches your profile', time: '2 hours ago' },
          { id: 2, type: 'reminder', message: 'You\'re eligible to donate again', time: '1 day ago' },
          { id: 3, type: 'achievement', message: 'Congratulations! You\'ve saved 3 lives', time: '3 days ago' }
        ],
        stats: {
          totalDonations: userDonations.length,
          livesImpacted: userDonations.length * 3,
          lastDonation: userDonations.length > 0 ? userDonations[userDonations.length - 1].donation_date : null,
          nextEligible: userDonations.length > 0 ? 
            new Date(new Date(userDonations[userDonations.length - 1].donation_date).getTime() + 56 * 24 * 60 * 60 * 1000) : 
            new Date()
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Your Dashboard',
      welcome: 'Welcome back',
      profile: {
        title: 'Donor Profile',
        edit: 'Edit Profile',
        notRegistered: 'Not registered as donor',
        registerNow: 'Register Now',
        bloodGroup: 'Blood Group',
        location: 'Location',
        phone: 'Phone',
        lastDonation: 'Last Donation',
        nextEligible: 'Next Eligible',
        status: 'Status'
      },
      stats: {
        title: 'Your Impact',
        donations: 'Total Donations',
        lives: 'Lives Impacted',
        badges: 'Badges Earned',
        nextDonation: 'Next Donation',
        daysUntil: 'Days Until Eligible'
      },
      requests: {
        title: 'Urgent Requests Near You',
        noRequests: 'No urgent requests in your area',
        viewAll: 'View All Requests',
        respond: 'Respond to Request'
      },
      notifications: {
        title: 'Recent Notifications',
        markRead: 'Mark as Read',
        noNotifications: 'No new notifications'
      },
      actions: {
        title: 'Quick Actions',
        donate: 'Schedule Donation',
        request: 'Request Blood',
        updateProfile: 'Update Profile',
        viewHistory: 'View History',
        addDonation: 'Add Donation Record'
      },
      badges: {
        newDonor: 'New Donor',
        hero: 'Hero Donor',
        lifeSaver: 'Life Saver',
        champion: 'Blood Champion',
        legend: 'Legend Donor'
      },
      status: {
        available: 'Available',
        notEligible: 'Not Eligible',
        pending: 'Pending Verification'
      }
    },
    hi: {
      title: 'आपका डैशबोर्ड',
      welcome: 'वापसी पर स्वागत है',
      profile: {
        title: 'दाता प्रोफाइल',
        edit: 'प्रोफाइल संपादित करें',
        notRegistered: 'दाता के रूप में पंजीकृत नहीं',
        registerNow: 'अभी पंजीकरण करें',
        bloodGroup: 'रक्त समूह',
        location: 'स्थान',
        phone: 'फोन',
        lastDonation: 'पिछला रक्तदान',
        nextEligible: 'अगली पात्रता',
        status: 'स्थिति'
      },
      stats: {
        title: 'आपका प्रभाव',
        donations: 'कुल रक्तदान',
        lives: 'प्रभावित जीवन',
        badges: 'अर्जित बैज',
        nextDonation: 'अगला रक्तदान',
        daysUntil: 'पात्र होने तक दिन'
      },
      requests: {
        title: 'आपके पास तत्काल अनुरोध',
        noRequests: 'आपके क्षेत्र में कोई तत्काल अनुरोध नहीं',
        viewAll: 'सभी अनुरोध देखें',
        respond: 'अनुरोध का जवाब दें'
      },
      notifications: {
        title: 'हाल की सूचनाएं',
        markRead: 'पढ़ा गया चिह्नित करें',
        noNotifications: 'कोई नई सूचना नहीं'
      },
      actions: {
        title: 'त्वरित कार्य',
        donate: 'रक्तदान निर्धारित करें',
        request: 'रक्त का अनुरोध करें',
        updateProfile: 'प्रोफाइल अपडेट करें',
        viewHistory: 'इतिहास देखें',
        addDonation: 'रक्तदान रिकॉर्ड जोड़ें'
      },
      badges: {
        newDonor: 'नया दाता',
        hero: 'हीरो दाता',
        lifeSaver: 'जीवनदाता',
        champion: 'रक्त चैंपियन',
        legend: 'लीजेंड दाता'
      },
      status: {
        available: 'उपलब्ध',
        notEligible: 'पात्र नहीं',
        pending: 'सत्यापन लंबित'
      }
    }
  };

  const t = translations[language];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'New Donor': return 'bg-blue-500';
      case 'Hero Donor': return 'bg-green-500';
      case 'Life Saver': return 'bg-yellow-500';
      case 'Blood Champion': return 'bg-purple-500';
      case 'Legend Donor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isEligibleToDonate = () => {
    if (!dashboardData.stats.lastDonation) return true;
    const nextEligible = new Date(dashboardData.stats.lastDonation);
    nextEligible.setDate(nextEligible.getDate() + 56);
    return new Date() >= nextEligible;
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your dashboard...</p>
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.welcome}, {user.name}!
          </h1>
          <p className="text-gray-600">{t.title}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Accepted Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AcceptedRequests user={user} donor={donorData} />
            </motion.div>
            



            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Award className="h-4 w-4 text-red-500 mr-2" />
                    {t.stats.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                      <Droplets className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {dashboardData.stats.totalDonations}
                      </div>
                      <div className="text-xs text-gray-600">{t.stats.donations}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                      <Heart className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {dashboardData.stats.livesImpacted}
                      </div>
                      <div className="text-xs text-gray-600">{t.stats.lives}</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                      <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {user.donorBadges?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">{t.stats.badges}</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {dashboardData.stats.nextEligible ? 
                          Math.max(0, Math.ceil((new Date(dashboardData.stats.nextEligible).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 
                          0
                        }
                      </div>
                      <div className="text-xs text-gray-600">{t.stats.daysUntil}</div>
                    </div>
                  </div>
                  
                  {user.donorBadges && user.donorBadges.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Your Badges:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.donorBadges.map((badge: string, index: number) => (
                          <Badge 
                            key={index}
                            className={`${getBadgeColor(badge)} text-white text-xs hover:scale-105 transition-transform cursor-pointer`}
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>




            



          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Award className="h-4 w-4 text-red-500 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium">Life Saver</div>
                        <div className="text-xs text-gray-600">First donation completed</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                      <Heart className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">Hero Donor</div>
                        <div className="text-xs text-gray-600">5+ donations completed</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Donation History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-red-500 mr-2" />
                      My Donations
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 px-2 text-xs hover:bg-red-50 hover:border-red-300"
                      onClick={async () => {
                        if (!donorData) return;
                        
                        try {
                          await supabaseService.createDonation({
                            donor_id: donorData.id,
                            donation_date: new Date().toISOString().split('T')[0],
                            location: 'Blood Bank',
                            amount_ml: 450,
                            notes: 'Manual entry'
                          });
                          fetchDashboardData();
                        } catch (error) {
                          console.error('Error adding donation:', error);
                        }
                      }}
                    >
                      + Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.donationHistory.length === 0 ? (
                    <div className="text-center py-4">
                      <Droplets className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">No donations yet</p>
                      <p className="text-xs text-gray-400">Record your first donation!</p>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {dashboardData.donationHistory.reverse().map((donation: any) => (
                        <div key={donation.id} className="border rounded-lg p-2 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-red-500 text-white text-xs">{donorData?.blood_group}</Badge>
                              <span className="text-xs font-medium">{donation.amount_ml}ml</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(donation.donation_date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{donation.location}</p>
                          <p className="text-xs text-green-600 font-medium">+3 Lives Saved</p>
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
    </div>
  );
}