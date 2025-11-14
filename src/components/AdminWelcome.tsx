import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Shield, Users, Activity, TrendingUp, Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';

interface AdminWelcomeProps {
  user: any;
}

export function AdminWelcome({ user }: AdminWelcomeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return { text: 'Good Night', icon: Moon, color: 'text-indigo-600' };
    if (hour < 12) return { text: 'Good Morning', icon: Sunrise, color: 'text-yellow-600' };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun, color: 'text-orange-600' };
    if (hour < 21) return { text: 'Good Evening', icon: Sunset, color: 'text-purple-600' };
    return { text: 'Good Night', icon: Moon, color: 'text-indigo-600' };
  };

  const greeting = getTimeGreeting();
  const GreetingIcon = greeting.icon;

  const quickStats = [
    { label: 'Active Users', value: '1,247', icon: Users, color: 'bg-blue-500' },
    { label: 'Today\'s Logins', value: '89', icon: Activity, color: 'bg-green-500' },
    { label: 'Blood Donations', value: '156', icon: TrendingUp, color: 'bg-red-500' },
    { label: 'System Uptime', value: '99.9%', icon: Clock, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Main Welcome Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-12 text-center">
                {/* Crown Icon */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-8"
                >
                  <Crown className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
                  <Shield className="h-12 w-12 text-blue-400 mx-auto" />
                </motion.div>

                {/* Time-based Greeting */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center mb-4">
                    <GreetingIcon className={`h-8 w-8 ${greeting.color} mr-3`} />
                    <h1 className="text-4xl font-bold">
                      {greeting.text}, {user.name}!
                    </h1>
                  </div>
                  <p className="text-xl text-gray-300 mb-2">
                    Welcome to the Admin Control Center
                  </p>
                  <p className="text-lg text-gray-400">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {currentTime.toLocaleTimeString()}
                  </p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                    >
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={() => navigate('/admin')}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
                    size="lg"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Enter Admin Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
                    size="lg"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    View User Portal
                  </Button>
                </motion.div>

                {/* Admin Privileges Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
                >
                  <p className="text-yellow-200 text-sm">
                    🔐 You have full administrative privileges. Handle with care.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-16 h-16 bg-red-500/20 rounded-full blur-sm"
          />
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 right-20 w-20 h-20 bg-blue-500/20 rounded-full blur-sm"
          />
        </div>
      </div>
    </div>
  );
}