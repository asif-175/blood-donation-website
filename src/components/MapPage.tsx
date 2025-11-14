import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Phone, Heart, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MapPageProps {
  language: string;
}

export function MapPage({ language }: MapPageProps) {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    location: '',
    radius: '10',
    city: '',
    state: ''
  });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    fetchDonors();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, donors]);

  const translations = {
    en: {
      title: 'Find Blood Donors Near You',
      subtitle: 'Connect with verified donors in your area',
      search: {
        bloodGroup: 'Blood Group',
        location: 'Search Location',
        radius: 'Search Radius (km)',
        apply: 'Apply Filters',
        clear: 'Clear Filters'
      },
      donors: {
        available: 'Available Donors',
        contact: 'Contact Donor',
        distance: 'km away',
        lastDonation: 'Last Donation',
        noResults: 'No donors found matching your criteria',
        badges: 'Achievements'
      },
      map: {
        yourLocation: 'Your Location',
        donorLocation: 'Donor Location',
        getDirections: 'Get Directions'
      }
    },
    hi: {
      title: 'अपने आस-पास रक्तदाता खोजें',
      subtitle: 'अपने क्षेत्र के सत्यापित दाताओं से जुड़ें',
      search: {
        bloodGroup: 'रक्त समूह',
        location: 'स्थान खोजें',
        radius: 'खोज त्रिज्या (किमी)',
        apply: 'फिल्टर लागू करें',
        clear: 'फिल्टर साफ़ करें'
      },
      donors: {
        available: 'उपलब्ध दाता',
        contact: 'दाता से संपर्क करें',
        distance: 'किमी दूर',
        lastDonation: 'पिछला रक्तदान',
        noResults: 'आपके मापदंड से मेल खाने वाले कोई दाता नहीं मिले',
        badges: 'उपलब्धियां'
      },
      map: {
        yourLocation: 'आपका स्थान',
        donorLocation: 'दाता का स्थान',
        getDirections: 'दिशा-निर्देश प्राप्त करें'
      }
    }
  };

  const t = translations[language];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = async () => {
    try {
      // Get registered donors from localStorage
      const registeredDonors = JSON.parse(localStorage.getItem('donors') || '[]');
      
      // Transform data to match expected format
      const donorsData = registeredDonors.map((donor: any) => ({
        id: donor.id,
        fullName: donor.fullName,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        state: donor.state,
        phone: donor.phone,
        lat: parseFloat(donor.latitude) || null,
        lng: parseFloat(donor.longitude) || null,
        lastDonation: donor.lastDonation,
        badges: ['Verified Donor']
      }));
      
      setDonors(donorsData);
      setFilteredDonors(donorsData);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const applyFilters = () => {
    let filtered = [...donors];

    if (filters.bloodGroup) {
      filtered = filtered.filter((donor: any) => donor.bloodGroup === filters.bloodGroup);
    }

    if (filters.location) {
      filtered = filtered.filter((donor: any) => 
        donor.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        donor.state?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.city) {
      filtered = filtered.filter((donor: any) => 
        donor.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.state) {
      filtered = filtered.filter((donor: any) => 
        donor.state?.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // Sort by distance if user location is available
    if (userLocation) {
      filtered = filtered.sort((a: any, b: any) => {
        const distA = a.lat && a.lng ? calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) : Infinity;
        const distB = b.lat && b.lng ? calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng) : Infinity;
        return distA - distB;
      });
    }

    setFilteredDonors(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ bloodGroup: '', location: '', radius: '10', city: '', state: '' });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10; // Round to 1 decimal place
  };

  const getDirections = (donorLat: number, donorLng: number) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${donorLat},${donorLng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${donorLat},${donorLng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 text-red-500 mr-2" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.search.bloodGroup}
                  </label>
                  <select
                    name="bloodGroup"
                    value={filters.bloodGroup}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.search.radius}
                  </label>
                  <select
                    name="radius"
                    value={filters.radius}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.search.location}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="city"
                      value={filters.city || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      className="p-3"
                    />
                    <select
                      name="state"
                      value={filters.state || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                      className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Bihar">Bihar</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => {
                    const location = filters.city && filters.state ? `${filters.city}, ${filters.state}` : filters.city || filters.state || '';
                    setFilters(prev => ({ ...prev, location }));
                    applyFilters();
                  }}
                  className="bg-red-600 hover:bg-red-700 px-8 py-3"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button
                  onClick={() => {
                    setFilters({ bloodGroup: '', location: '', radius: '10', city: '', state: '' });
                    setFilteredDonors(donors);
                  }}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder and Donors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Realistic District Map */}
          <div>
            <Card className="h-96">
              <CardContent className="p-0 h-full">
                <div className="h-full bg-blue-50 rounded-lg relative overflow-hidden">
                  {(filters.city || filters.state === 'Andhra Pradesh') ? (
                    <div className="h-full relative">
                      {filters.city?.toLowerCase().includes('vinukonda') || filters.city?.toLowerCase().includes('guntur') ? (
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                          <path d="M50 50 L350 50 L350 250 L50 250 Z M80 80 L120 60 L180 80 L220 100 L280 90 L320 120 L300 180 L250 220 L180 200 L120 180 L80 140 Z" 
                                fill="#e8f5e8" stroke="#4ade80" strokeWidth="2"/>
                          <text x="200" y="30" textAnchor="middle" className="text-sm font-semibold fill-gray-800">Guntur District</text>
                        </svg>
                      ) : filters.city?.toLowerCase().includes('vijayawada') ? (
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                          <path d="M60 60 L340 60 L340 240 L60 240 Z M90 90 L150 70 L200 90 L260 80 L310 110 L290 170 L240 210 L170 190 L110 170 L90 130 Z" 
                                fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2"/>
                          <text x="200" y="30" textAnchor="middle" className="text-sm font-semibold fill-gray-800">Krishna District</text>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                          <path d="M100 50 L300 50 L350 100 L350 200 L300 250 L100 250 L50 200 L50 100 Z" 
                                fill="#f0fdf4" stroke="#22c55e" strokeWidth="2"/>
                          <text x="200" y="30" textAnchor="middle" className="text-sm font-semibold fill-gray-800">Andhra Pradesh</text>
                        </svg>
                      )}
                      
                      {(filters.city || filters.state) && (
                        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                          <h3 className="font-semibold text-gray-900">
                            {filters.city}{filters.city && filters.state ? ', ' : ''}{filters.state}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {filteredDonors.length} donors {filters.bloodGroup ? `with ${filters.bloodGroup}` : 'available'}
                          </p>
                        </div>
                      )}
                      
                      {filteredDonors.slice(0, 8).map((donor: any, index) => {
                        const positions = [{x: 25, y: 35}, {x: 45, y: 25}, {x: 65, y: 40}, {x: 35, y: 55}];
                        const pos = positions[index] || {x: 50, y: 50};
                        return (
                          <div key={donor.id} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-150 transition-transform ${
                              filters.bloodGroup && donor.bloodGroup === filters.bloodGroup ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-10">
                                {donor.fullName} ({donor.bloodGroup})
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Select a city to view map</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donors List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Top 3 Nearest Donors ({filteredDonors.length} total)
              </h2>
              {(filters.location || filters.city || filters.state) && (
                <Badge className="bg-blue-100 text-blue-800">
                  in {filters.location || `${filters.city}${filters.city && filters.state ? ', ' : ''}${filters.state}`}
                </Badge>
              )}
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredDonors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.donors.noResults}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {!(filters.bloodGroup && (filters.city || filters.state)) ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Select blood group and location</p>
                    <p className="text-sm text-gray-400">to see top 3 nearest donors</p>
                  </div>
                ) : (
                  filteredDonors.slice(0, 3).map((donor: any, index) => (
                    <motion.div
                      key={donor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`hover:shadow-lg transition-shadow ${
                        index === 0 ? 'border-green-500 bg-green-50' : 
                        index === 1 ? 'border-blue-500 bg-blue-50' : 
                        'border-orange-500 bg-orange-50'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                index === 0 ? 'bg-green-100' : 
                                index === 1 ? 'bg-blue-100' : 
                                'bg-orange-100'
                              }`}>
                                <Heart className={`h-6 w-6 ${
                                  index === 0 ? 'text-green-500' : 
                                  index === 1 ? 'text-blue-500' : 
                                  'text-orange-500'
                                }`} />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{donor.fullName}</h3>
                                  {index === 0 && <Badge className="bg-green-500 text-white text-xs">Nearest</Badge>}
                                  {index === 1 && <Badge className="bg-blue-500 text-white text-xs">2nd Closest</Badge>}
                                  {index === 2 && <Badge className="bg-orange-500 text-white text-xs">3rd Closest</Badge>}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <MapPin className="h-3 w-3" />
                                  <span>{donor.city}, {donor.state}</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="destructive" className="text-sm">
                                    {donor.bloodGroup}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  alert(`Contact ${donor.fullName} at ${donor.phone || 'Phone not available'}`);
                                }}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                {t.donors.contact}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact Section */}
        <Card className="mt-12 bg-red-50 border-red-200">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Emergency Blood Required?</h3>
            <p className="text-gray-600 mb-6">
              For critical emergencies, call our 24/7 helpline for immediate assistance
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Phone className="h-5 w-5 mr-2" />
                Call Emergency Helpline
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5 mr-2" />
                Request Help Online
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}