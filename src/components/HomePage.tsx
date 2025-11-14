import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Users, MapPin, Clock, Award, Shield, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { mockData } from '../utils/mockData';
import { translations, getWelcomeMessage } from '../utils/translations';

interface HomePageProps {
  language: string;
  user: any;
}

export function HomePage({ language, user }: HomePageProps) {
  const [stats, setStats] = useState({
    totalDonors: 0,
    bloodUnitsCollected: 0,
    livesImpacted: 0,
    emergencyRequests: 0
  });
  const [urgentRequests, setUrgentRequests] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchUrgentRequests();
    fetchSuccessStories();
  }, []);

  const fetchStats = async () => {
    try {
      setStats(mockData.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUrgentRequests = async () => {
    try {
      setUrgentRequests(mockData.urgentRequests.slice(0, 3));
    } catch (error) {
      console.error('Error fetching urgent requests:', error);
    }
  };

  const fetchSuccessStories = async () => {
    try {
      setSuccessStories(mockData.successStories.slice(0, 3));
    } catch (error) {
      console.error('Error fetching success stories:', error);
    }
  };

  const translations = {
    en: {
      hero: {
        title: "Save Lives Together",
        subtitle: "Donate Blood, Help in Emergencies",
        description: "Join our community of life-savers. Your blood donation can save up to 3 lives. Be the hero someone needs today.",
        donateBtn: "Donate Blood Now",
        requestBtn: "Request Emergency Help",
        emergencyBtn: "🚨 Emergency Alert"
      },
      mission: {
        title: "Our Mission",
        description: "To create a seamless platform connecting blood donors, recipients, and hospitals for immediate emergency blood assistance.",
        values: [
          { title: "Fast Response", desc: "Emergency blood requests processed within minutes", icon: Clock },
          { title: "Verified Donors", desc: "All donors are verified with medical screening", icon: Shield },
          { title: "Community Impact", desc: "Building a network of life-savers across communities", icon: Users },
          { title: "24/7 Support", desc: "Round-the-clock emergency assistance", icon: Phone }
        ]
      },
      stats: {
        title: "Impact We've Made Together",
        donors: "Registered Donors",
        units: "Blood Units Collected",
        lives: "Lives Impacted",
        requests: "Emergency Requests Fulfilled"
      },
      urgent: {
        title: "Urgent Blood Requests",
        subtitle: "People need your help right now",
        viewAll: "View All Requests",
        noRequests: "No urgent requests at the moment"
      },
      stories: {
        title: "Success Stories",
        subtitle: "Real stories from our community",
        readMore: "Read More Stories"
      },
      cta: {
        title: "Ready to Make a Difference?",
        subtitle: "Join thousands of donors who are saving lives every day",
        register: "Register as Donor",
        learn: "Learn More"
      }
    },
    hi: {
      hero: {
        title: "मिलकर जिंदगियां बचाएं",
        subtitle: "रक्तदान करें, आपातकाल में मदद करें",
        description: "जीवनदाताओं के हमारे समुदाय से जुड़ें। आपका रक्तदान 3 जिंदगियां बचा सकता है। आज किसी के लिए हीरो बनें।",
        donateBtn: "अभी रक्तदान करें",
        requestBtn: "आपातकालीन मदद मांगें",
        emergencyBtn: "🚨 आपातकालीन अलर्ट"
      },
      mission: {
        title: "हमारा मिशन",
        description: "तत्काल आपातकालीन रक्त सहायता के लिए रक्तदाताओं, प्राप्तकर्ताओं और अस्पतालों को जोड़ने वाला एक सुगम मंच बनाना।",
        values: [
          { title: "तेज़ प्रतिक्रिया", desc: "आपातकालीन रक्त अनुरोध मिनटों में संसाधित", icon: Clock },
          { title: "सत्यापित दाता", desc: "सभी दाता चिकित्सा जांच के साथ सत्यापित हैं", icon: Shield },
          { title: "सामुदायिक प्रभाव", desc: "समुदायों में जीवनदाताओं का नेटवर्क बनाना", icon: Users },
          { title: "24/7 सपोर्ट", desc: "चौबीसों घंटे आपातकालीन सहायता", icon: Phone }
        ]
      },
      stats: {
        title: "हमने मिलकर जो प्रभाव डाला है",
        donors: "पंजीकृत दाता",
        units: "रक्त यूनिट एकत्रित",
        lives: "प्रभावित जीवन",
        requests: "पूरे किए गए आपातकालीन अनुरोध"
      },
      urgent: {
        title: "तत्काल रक्त अनुरोध",
        subtitle: "लोगों को अभी आपकी मदद चाहिए",
        viewAll: "सभी अनुरोध देखें",
        noRequests: "फिलहाल कोई तत्काल अनुरोध नहीं"
      },
      stories: {
        title: "सफलता की कहानियां",
        subtitle: "हमारे समुदाय की वास्तविक कहानियां",
        readMore: "और कहानियां पढ़ें"
      },
      cta: {
        title: "बदलाव लाने के लिए तैयार हैं?",
        subtitle: "हजारों दाताओं से जुड़ें जो हर दिन जिंदगियां बचा रहे हैं",
        register: "दाता के रूप में पंजीकरण करें",
        learn: "और जानें"
      }
    }
  };

  const t = translations[language] || translations.en;
  
  // Add icon mapping for mission values
  const missionValues = t.mission.values.map((value, index) => ({
    ...value,
    icon: [Clock, Shield, Users, Phone][index]
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {user && (
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-red-100">
                    {language === 'en' ? `Welcome, ${user.name}!` : `स्वागत है, ${user.name}!`}
                  </h3>
                </div>
              )}
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t.hero.title}
              </h1>
              <h2 className="text-2xl lg:text-3xl mb-6 text-red-100">
                {t.hero.subtitle}
              </h2>
              <p className="text-xl mb-8 text-red-100 leading-relaxed">
                {t.hero.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4">
                    <Heart className="h-5 w-5 mr-2" />
                    {t.hero.donateBtn}
                  </Button>
                </Link>
                <Link to="/request">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4">
                    <Phone className="h-5 w-5 mr-2" />
                    {t.hero.requestBtn}
                  </Button>
                </Link>
              </div>

              {/* Emergency Button */}
              <motion.div
                className="mt-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Link to="/request">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4">
                    <Bell className="h-5 w-5 mr-2 animate-pulse" />
                    {t.hero.emergencyBtn}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <motion.div
                      className="text-4xl font-bold mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {stats.totalDonors.toLocaleString()}+
                    </motion.div>
                    <div className="text-red-100">{t.stats.donors}</div>
                  </div>
                  <div>
                    <motion.div
                      className="text-4xl font-bold mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      {stats.bloodUnitsCollected.toLocaleString()}+
                    </motion.div>
                    <div className="text-red-100">{t.stats.units}</div>
                  </div>
                  <div>
                    <motion.div
                      className="text-4xl font-bold mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                    >
                      {stats.livesImpacted.toLocaleString()}+
                    </motion.div>
                    <div className="text-red-100">{t.stats.lives}</div>
                  </div>
                  <div>
                    <motion.div
                      className="text-4xl font-bold mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1, type: "spring" }}
                    >
                      {stats.emergencyRequests.toLocaleString()}+
                    </motion.div>
                    <div className="text-red-100">{t.stats.requests}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.mission.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.mission.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missionValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center h-full border-red-100 hover:border-red-200 transition-colors">
                  <CardContent className="p-8">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Requests Section */}
      {urgentRequests.length > 0 && (
        <section className="py-20 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.urgent.title}</h2>
              <p className="text-xl text-gray-600 mb-8">{t.urgent.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {urgentRequests.map((request: any, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-red-200 hover:border-red-400 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="destructive" className="animate-pulse">
                          URGENT
                        </Badge>
                        <span className="text-2xl font-bold text-red-600">
                          {request.bloodGroup}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {request.patientName}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{request.hospital}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Units needed: {request.unitsNeeded}
                      </p>
                      <Link to={`/request/${request.id}`}>
                        <Button className="w-full" variant="destructive">
                          Help Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/request">
                <Button variant="outline" size="lg">
                  {t.urgent.viewAll}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Success Stories Section */}
      {successStories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.stories.title}</h2>
              <p className="text-xl text-gray-600">{t.stories.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {successStories.map((story: any, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-red-100 hover:border-red-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Award className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="font-semibold text-gray-900">{story.donorName}</span>
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{story.story}"</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/feedback">
                <Button variant="outline" size="lg">
                  {t.stories.readMore}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">{t.cta.title}</h2>
            <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4">
                  <Heart className="h-5 w-5 mr-2" />
                  {t.cta.register}
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4">
                  {t.cta.learn}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}