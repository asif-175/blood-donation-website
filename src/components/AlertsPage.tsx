import React, { useState, useEffect } from 'react';
import { Bell, Phone, Heart, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

interface AlertsPageProps {
  user: any;
  language: string;
}

export function AlertsPage({ user, language }: AlertsPageProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = () => {
    try {
      // Get user's blood group from donor registration
      const donors = JSON.parse(localStorage.getItem('donors') || '[]');
      const userDonor = donors.find((donor: any) => donor.userId === user.id);
      
      if (!userDonor) {
        setAlerts([]);
        setIsLoading(false);
        return;
      }

      // Get all blood requests
      const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
      
      // Filter compatible requests
      const compatibleRequests = getCompatibleRequests(userDonor.bloodGroup, bloodRequests);
      
      // Get existing responses to avoid duplicates
      const responses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
      const respondedIds = responses.map((r: any) => r.requestId);
      
      // Filter out already responded requests
      const newAlerts = compatibleRequests.filter((req: any) => 
        !respondedIds.includes(req.id) && req.status === 'active'
      );
      
      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
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
      compatibleGroups.includes(request.bloodGroup)
    );
  };

  const handleResponse = (requestId: string, response: 'accept' | 'reject') => {
    try {
      // Save response
      const responses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
      responses.push({
        requestId,
        response,
        timestamp: new Date().toISOString(),
        donorId: user.id
      });
      localStorage.setItem(`responses_${user.id}`, JSON.stringify(responses));
      
      if (response === 'accept') {
        // Save accepted request details
        const request = alerts.find(alert => alert.id === requestId);
        const acceptedRequests = JSON.parse(localStorage.getItem(`accepted_${user.id}`) || '[]');
        acceptedRequests.push({
          ...request,
          acceptedAt: new Date().toISOString()
        });
        localStorage.setItem(`accepted_${user.id}`, JSON.stringify(acceptedRequests));
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Remove from alerts
        setAlerts(prev => prev.filter(alert => alert.id !== requestId));
      }
    } catch (error) {
      console.error('Error saving response:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Bell className="h-12 w-12 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Blood Donation Alerts</h1>
          </div>
          <p className="text-gray-600">
            {alerts.length > 0 
              ? `You have ${alerts.length} new blood donation request${alerts.length > 1 ? 's' : ''}`
              : 'No new blood donation requests at the moment'
            }
          </p>
        </motion.div>

        {/* Alerts */}
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts</h3>
            <p className="text-gray-600">No new blood requests match your blood group.</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 min-w-max">
              {alerts
                .sort((a, b) => {
                  const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                  const aUrgency = urgencyOrder[a.urgencyLevel] || 3;
                  const bUrgency = urgencyOrder[b.urgencyLevel] || 3;
                  if (aUrgency !== bUrgency) return aUrgency - bUrgency;
                  return a.city.localeCompare(b.city);
                })
                .map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-80"
                >
                  <Card className={`h-full border-2 hover:shadow-lg transition-all duration-200 ${
                    alert.urgencyLevel === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.urgencyLevel === 'high' ? 'border-orange-400 bg-orange-50' :
                    'border-yellow-400 bg-yellow-50'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getUrgencyColor(alert.urgencyLevel)} text-white text-xs`}>
                          {alert.urgencyLevel?.toUpperCase()}
                        </Badge>
                        <div className="font-bold text-red-600 text-xl">{alert.bloodGroup}</div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{alert.patientName}</h4>
                          <p className="text-xs text-gray-600">{alert.hospital}</p>
                          <p className="text-xs text-gray-500">{alert.city}</p>
                        </div>
                        
                        <div className="bg-white p-2 rounded border">
                          <p className="text-xs"><strong>Contact:</strong> {alert.contactPerson}</p>
                          <p className="text-xs"><strong>Phone:</strong> {alert.phone}</p>
                        </div>
                        
                        {alert.urgencyLevel === 'critical' && (
                          <div className="bg-red-100 p-2 rounded border border-red-300">
                            <p className="text-xs text-red-700 font-medium flex items-center">
                              <div className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                              CRITICAL - Life Threatening
                            </p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleResponse(alert.id, 'accept')}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-xs py-2"
                          >
                            Accept
                          </Button>
                          <Button 
                            onClick={() => handleResponse(alert.id, 'reject')}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 text-xs py-2"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}