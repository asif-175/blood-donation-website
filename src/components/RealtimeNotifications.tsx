import React, { useEffect, useState } from 'react';
import { Bell, X, Heart, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import type { BloodRequest } from '../services/supabaseService';

interface RealtimeNotificationsProps {
  user: any;
  donor: any;
}

interface Notification {
  id: string;
  type: 'blood_request' | 'urgent' | 'match';
  title: string;
  message: string;
  data?: BloodRequest;
  timestamp: Date;
}

export function RealtimeNotifications({ user, donor }: RealtimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!donor) return;

    // Subscribe to new blood requests
    const subscription = supabaseService.subscribeToBloodRequests((payload) => {
      const newRequest = payload.new as BloodRequest;
      
      // Check if this request is compatible with the donor
      const compatibleGroups = supabaseService.getCompatibleBloodGroups(donor.blood_group);
      
      if (compatibleGroups.includes(newRequest.blood_group)) {
        const notification: Notification = {
          id: newRequest.id,
          type: newRequest.urgency_level === 'critical' ? 'urgent' : 'blood_request',
          title: newRequest.urgency_level === 'critical' ? 'URGENT Blood Request!' : 'New Blood Request',
          message: `${newRequest.patient_name} needs ${newRequest.blood_group} blood at ${newRequest.hospital}`,
          data: newRequest,
          timestamp: new Date()
        };

        setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
        setIsVisible(true);

        // Auto-hide after 10 seconds for non-critical requests
        if (newRequest.urgency_level !== 'critical') {
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 10000);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [donor]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`mb-3 p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'urgent' 
                ? 'bg-red-50 border-red-500' 
                : 'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  notification.type === 'urgent' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'urgent' ? (
                    <Heart className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${
                    notification.type === 'urgent' ? 'text-red-800' : 'text-blue-800'
                  }`}>
                    {notification.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    notification.type === 'urgent' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {notification.message}
                  </p>
                  {notification.data && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>Urgency: {notification.data.urgency_level}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Units needed: {notification.data.units_needed}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => window.location.href = '/alerts'}
                      className={`px-3 py-1 text-xs rounded-md font-medium ${
                        notification.type === 'urgent'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Respond
                    </button>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="px-3 py-1 text-xs rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={dismissAll}
          className="w-full mt-2 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Dismiss All ({notifications.length})
        </motion.button>
      )}
    </div>
  );
}