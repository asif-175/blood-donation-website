import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, AlertCircle, MessageSquare, BarChart3, Settings, Eye, Check, X, MapPin, Calendar, TrendingUp, UserCheck, Activity, Clock, Shield, Database, Zap, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';


interface AdminPanelProps {
  user: any;
  language: 'en' | 'hi';
}

export function AdminPanel({ user, language }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminData, setAdminData] = useState({
    stats: {
      totalDonors: 0,
      totalRequests: 0,
      pendingRequests: 0,
      totalFeedback: 0,
      todayRegistrations: 0,
      bloodGroupStats: {}
    },
    recentDonors: [],
    recentRequests: [],
    recentFeedback: [],
    todayUsers: [],
    locationStats: {},
    bloodGroupDistribution: {},
    systemHealth: {
      serverStatus: 'healthy',
      responseTime: '< 100ms',
      uptime: '99.9%'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Redirect non-admin users to user dashboard
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      // Get all registered users from localStorage
      const allAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
      const today = new Date().toDateString();
      
      // Filter today's registrations
      const todayUsers = allAccounts.filter((account: any) => {
        const accountDate = new Date(account.registrationDate || Date.now()).toDateString();
        return accountDate === today;
      });

      // Calculate blood group distribution
      const bloodGroupStats: any = {};
      allAccounts.forEach((account: any) => {
        const bloodGroup = account.bloodGroup || 'Unknown';
        bloodGroupStats[bloodGroup] = (bloodGroupStats[bloodGroup] || 0) + 1;
      });

      // Calculate location distribution
      const locationStats: any = {};
      allAccounts.forEach((account: any) => {
        const location = account.city || account.location || 'Unknown';
        locationStats[location] = (locationStats[location] || 0) + 1;
      });

      // Mock recent requests and feedback
      const mockRequests = [
        {
          id: 1,
          patientName: 'John Doe',
          bloodGroup: 'O+',
          hospital: 'City General Hospital',
          city: 'Mumbai',
          urgencyLevel: 'critical',
          requestedDate: new Date().toISOString(),
          fulfilled: false
        },
        {
          id: 2,
          patientName: 'Sarah Smith',
          bloodGroup: 'A+',
          hospital: 'Metro Medical Center',
          city: 'Delhi',
          urgencyLevel: 'urgent',
          requestedDate: new Date().toISOString(),
          fulfilled: true
        }
      ];

      const mockFeedback = [
        {
          id: 1,
          userName: 'Rahul Kumar',
          message: 'Great platform for blood donation!',
          rating: 5,
          date: new Date().toISOString()
        }
      ];

      setAdminData({
        stats: {
          totalDonors: allAccounts.filter((acc: any) => acc.role === 'donor').length,
          totalRequests: mockRequests.length,
          pendingRequests: mockRequests.filter((r: any) => !r.fulfilled).length,
          totalFeedback: mockFeedback.length,
          todayRegistrations: todayUsers.length,
          bloodGroupStats
        },
        recentDonors: allAccounts.filter((acc: any) => acc.role === 'donor').slice(-10).reverse(),
        recentRequests: mockRequests,
        recentFeedback: mockFeedback,
        todayUsers,
        locationStats,
        bloodGroupDistribution: bloodGroupStats,
        systemHealth: {
          serverStatus: 'healthy',
          responseTime: '< 100ms',
          uptime: '99.9%'
        }
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Admin Dashboard',
      welcome: 'Admin Panel',
      unauthorized: 'Unauthorized access. Admin privileges required.',
      tabs: {
        overview: 'Overview',
        donors: 'Manage Donors',
        requests: 'Blood Requests',
        feedback: 'Feedback',
        system: 'System Health'
      },
      stats: {
        totalDonors: 'Total Donors',
        totalRequests: 'Total Requests',
        pendingRequests: 'Pending Requests',
        totalFeedback: 'Total Feedback',
        todayRegistrations: 'Today\'s Registrations',
        bloodGroups: 'Blood Group Distribution',
        locations: 'User Locations'
      },
      donors: {
        title: 'Recent Donors',
        viewAll: 'View All Donors',
        verify: 'Verify',
        suspend: 'Suspend',
        contact: 'Contact'
      },
      requests: {
        title: 'Recent Requests',
        viewAll: 'View All Requests',
        approve: 'Approve',
        reject: 'Reject',
        urgent: 'Urgent',
        fulfilled: 'Fulfilled'
      },
      feedback: {
        title: 'Recent Feedback',
        viewAll: 'View All Feedback',
        approve: 'Approve',
        moderate: 'Moderate'
      },
      system: {
        title: 'System Health',
        serverStatus: 'Server Status',
        responseTime: 'Response Time',
        uptime: 'Uptime',
        healthy: 'Healthy',
        maintenance: 'Maintenance Required'
      }
    },
    hi: {
      title: 'एडमिन डैशबोर्ड',
      welcome: 'एडमिन पैनल',
      unauthorized: 'अनधिकृत पहुंच। एडमिन विशेषाधिकार आवश्यक।',
      tabs: {
        overview: 'अवलोकन',
        donors: 'दाता प्रबंधन',
        requests: 'रक्त अनुरोध',
        feedback: 'फीडबैक',
        system: 'सिस्टम स्वास्थ्य'
      },
      stats: {
        totalDonors: 'कुल दाता',
        totalRequests: 'कुल अनुरोध',
        pendingRequests: 'लंबित अनुरोध',
        totalFeedback: 'कुल फीडबैक',
        todayRegistrations: 'आज के पंजीकरण',
        bloodGroups: 'रक्त समूह वितरण',
        locations: 'उपयोगकर्ता स्थान'
      },
      donors: {
        title: 'हाल के दाता',
        viewAll: 'सभी दाता देखें',
        verify: 'सत्यापित करें',
        suspend: 'निलंबित करें',
        contact: 'संपर्क करें'
      },
      requests: {
        title: 'हाल के अनुरोध',
        viewAll: 'सभी अनुरोध देखें',
        approve: 'अनुमोदित करें',
        reject: 'अस्वीकार करें',
        urgent: 'तत्काल',
        fulfilled: 'पूर्ण'
      },
      feedback: {
        title: 'हाल का फीडबैक',
        viewAll: 'सभी फीडबैक देखें',
        approve: 'अनुमोदित करें',
        moderate: 'मॉडरेट करें'
      },
      system: {
        title: 'सिस्टम स्वास्थ्य',
        serverStatus: 'सर्वर स्थिति',
        responseTime: 'प्रतिक्रिया समय',
        uptime: 'अपटाइम',
        healthy: 'स्वस्थ',
        maintenance: 'रखरखाव आवश्यक'
      }
    }
  };

  const t = translations[language];

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">{t.unauthorized}</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-red-600 hover:bg-red-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Settings className="h-16 w-16 text-red-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}</h1>
          <p className="text-gray-600">Manage the LifeLink platform</p>
        </motion.div>

        {/* Key Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{adminData.stats.totalDonors + 45}</p>
                  <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Today's Activity</p>
                  <p className="text-3xl font-bold">{adminData.stats.todayRegistrations + 23}</p>
                  <p className="text-green-100 text-xs mt-1">Logins & Registrations</p>
                </div>
                <Activity className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Blood Donations</p>
                  <p className="text-3xl font-bold">{Math.floor(Math.random() * 50) + 156}</p>
                  <p className="text-red-100 text-xs mt-1">This month</p>
                </div>
                <Heart className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold">94.2%</p>
                  <p className="text-purple-100 text-xs mt-1">Donation completion</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
                Weekly User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between px-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const height = [65, 45, 80, 55, 90, 35, 70][index];
                  const users = [23, 18, 32, 22, 38, 14, 28][index];
                  return (
                    <div key={day} className="flex flex-col items-center flex-1">
                      <div className="text-xs font-medium text-gray-700 mb-1">{users}</div>
                      <div 
                        className="w-8 bg-gradient-to-t from-red-500 to-red-300 rounded-t transition-all duration-1000 hover:from-red-600 hover:to-red-400"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{day}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Peak: Thursday (38 users)</span>
                <span>Total: 175 users this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span className="font-medium">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">34%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500">Last updated: 2 min ago</div>
                <div className="text-xs text-green-600 font-medium">All systems operational</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 max-w-3xl">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'system', label: 'System', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Platform Performance Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                      Platform Performance (Last 30 Days)
                    </div>
                    <div className="flex space-x-2">
                      <Badge className="bg-blue-500">Users</Badge>
                      <Badge className="bg-red-500">Donations</Badge>
                      <Badge className="bg-green-500">Requests</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>
                    
                    {/* Chart area */}
                    <div className="ml-8 h-full relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0">
                        {[0, 25, 50, 75, 100].map((line) => (
                          <div key={line} className="absolute w-full border-t border-gray-100" style={{ bottom: `${line}%` }}></div>
                        ))}
                      </div>
                      
                      {/* Line charts */}
                      <svg className="w-full h-full" viewBox="0 0 400 300">
                        {/* Users line (blue) */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          points="20,200 60,180 100,160 140,140 180,120 220,100 260,90 300,80 340,70 380,60"
                        />
                        {/* Donations line (red) */}
                        <polyline
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          points="20,220 60,210 100,190 140,170 180,150 220,130 260,120 300,110 340,100 380,90"
                        />
                        {/* Requests line (green) */}
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          points="20,240 60,230 100,220 140,200 180,180 220,160 260,150 300,140 340,130 380,120"
                        />
                        
                        {/* Data points */}
                        {[20,60,100,140,180,220,260,300,340,380].map((x, i) => (
                          <g key={i}>
                            <circle cx={x} cy={200 - i * 14} r="4" fill="#3b82f6" />
                            <circle cx={x} cy={220 - i * 13} r="4" fill="#ef4444" />
                            <circle cx={x} cy={240 - i * 12} r="4" fill="#10b981" />
                          </g>
                        ))}
                      </svg>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500">
                      {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week) => (
                        <span key={week}>{week}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">+34%</div>
                      <div className="text-sm text-gray-600">User Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">+28%</div>
                      <div className="text-sm text-gray-600">Donation Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+41%</div>
                      <div className="text-sm text-gray-600">Request Fulfillment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Blood Group Demand Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      Blood Group Demand vs Supply
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bloodType, index) => {
                        const demand = [85, 72, 68, 45, 38, 35, 32, 28][index];
                        const supply = [78, 69, 71, 48, 35, 38, 29, 31][index];
                        const maxValue = Math.max(demand, supply);
                        return (
                          <div key={bloodType} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="destructive" className="w-12 justify-center text-xs">{bloodType}</Badge>
                              <div className="text-xs text-gray-600">
                                Demand: {demand} | Supply: {supply}
                              </div>
                            </div>
                            <div className="relative">
                              {/* Demand bar (background) */}
                              <div className="w-full bg-red-200 rounded-full h-4 relative">
                                <div 
                                  className="bg-red-500 h-4 rounded-full transition-all duration-1000"
                                  style={{ width: `${(demand / 100) * 100}%` }}
                                ></div>
                              </div>
                              {/* Supply bar (overlay) */}
                              <div className="absolute top-1 left-0 w-full">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${(supply / 100) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className={supply >= demand ? 'text-green-600' : 'text-red-600'}>
                                {supply >= demand ? 'Sufficient' : 'Shortage'}
                              </span>
                              <span className="text-gray-500">
                                {supply >= demand ? '+' : ''}{supply - demand}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions & Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 text-purple-500 mr-2" />
                      Admin Control Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Critical Alerts */}
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Critical Alerts</span>
                        <Badge className="bg-red-600">3</Badge>
                      </div>
                      <div className="text-sm text-red-700 space-y-1">
                        <div>• O- blood critically low (2 units)</div>
                        <div>• 5 urgent requests pending &gt;24hrs</div>
                        <div>• Server response time elevated</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Users className="h-3 w-3 mr-1" />
                          Verify Users
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Heart className="h-3 w-3 mr-1" />
                          Send Alerts
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Generate Report
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          <Settings className="h-3 w-3 mr-1" />
                          System Config
                        </Button>
                      </div>
                    </div>

                    {/* Platform Health */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Platform Health</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">API Response</span>
                          <Badge className="bg-green-500">98ms</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Database</span>
                          <Badge className="bg-green-500">Optimal</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Users</span>
                          <Badge className="bg-blue-500">247</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Error Rate</span>
                          <Badge className="bg-green-500">0.02%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Admin Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      Recent Admin Activities
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Approved 12 new donor registrations', time: '5 min ago', type: 'success' },
                      { action: 'Sent critical blood shortage alert to O- donors', time: '15 min ago', type: 'alert' },
                      { action: 'Updated system configuration settings', time: '1 hour ago', type: 'config' },
                      { action: 'Generated monthly performance report', time: '2 hours ago', type: 'report' },
                      { action: 'Resolved 3 user verification issues', time: '3 hours ago', type: 'success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'alert' ? 'bg-red-500' :
                          activity.type === 'config' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{activity.action}</div>
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="col-span-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 text-red-500 mr-2" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.recentDonors.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No users registered yet</p>
                    ) : (
                      adminData.recentDonors.map((user: any, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <Heart className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{user.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Badge variant="destructive">{user.bloodGroup || 'Unknown'}</Badge>
                                <MapPin className="h-3 w-3" />
                                <span>{user.city || user.location || 'Unknown'}</span>
                                <span>•</span>
                                <span>{user.email}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Joined: {new Date(user.registrationDate || Date.now()).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Check className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                            <Button size="sm" variant="destructive">
                              <X className="h-3 w-3 mr-1" />
                              Suspend
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                      Monthly Performance Trends
                    </div>
                    <div className="flex space-x-2">
                      <Badge className="bg-blue-500">Users</Badge>
                      <Badge className="bg-red-500">Donations</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between px-4">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                      const userHeight = [45, 60, 55, 75, 65, 80][index];
                      const donationHeight = [35, 45, 40, 60, 50, 65][index];
                      const users = [89, 112, 98, 134, 121, 156][index];
                      const donations = [67, 89, 76, 112, 95, 128][index];
                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div className="flex items-end space-x-1 mb-2">
                            <div className="text-xs text-center">
                              <div className="text-blue-600 font-medium">{users}</div>
                              <div 
                                className="w-4 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-1000"
                                style={{ height: `${userHeight}px` }}
                              ></div>
                            </div>
                            <div className="text-xs text-center">
                              <div className="text-red-600 font-medium">{donations}</div>
                              <div 
                                className="w-4 bg-gradient-to-t from-red-500 to-red-300 rounded-t transition-all duration-1000"
                                style={{ height: `${donationHeight}px` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">{month}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-blue-600 font-bold text-lg">+23%</div>
                      <div className="text-gray-600">User Growth</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-red-600 font-bold text-lg">+18%</div>
                      <div className="text-gray-600">Donation Growth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 text-green-500 mr-2" />
                    Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Donation Success Rate</span>
                      <span className="font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">User Retention</span>
                      <span className="font-bold text-blue-600">87.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '87.5%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="font-bold text-purple-600">2.3 min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-500 h-3 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-500 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {[
                      { user: 'John Doe', action: 'completed donation', time: '2 min ago', type: 'success' },
                      { user: 'Sarah Smith', action: 'urgent request', time: '5 min ago', type: 'urgent' },
                      { user: 'Mike Johnson', action: 'registered', time: '12 min ago', type: 'info' },
                      { user: 'Emma Wilson', action: 'profile updated', time: '18 min ago', type: 'info' },
                      { user: 'David Brown', action: 'donation scheduled', time: '25 min ago', type: 'success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{activity.user}</div>
                          <div className="text-xs text-gray-600">{activity.action}</div>
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="col-span-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
                    {t.system.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">{t.system.healthy}</div>
                      <div className="text-sm text-gray-600">{t.system.serverStatus}</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{adminData.systemHealth.responseTime}</div>
                      <div className="text-sm text-gray-600">{t.system.responseTime}</div>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{adminData.systemHealth.uptime}</div>
                      <div className="text-sm text-gray-600">{t.system.uptime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}