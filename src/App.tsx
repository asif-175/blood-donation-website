import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Globe, User, LogOut, Home, UserPlus, Phone, Users, Info, Mail, BarChart3, ChevronDown, Edit, MessageSquare, Bell } from 'lucide-react';
import { Button } from './components/ui/button';
import { HomePage } from './components/HomePage';
import { RegisterPage } from './components/RegisterPage';
import { RequestHelpPage } from './components/RequestHelpPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { FeedbackPage } from './components/FeedbackPage';
import { MapPage } from './components/MapPage';
import { Auth } from './components/Auth';
import { EditProfile } from './components/EditProfile';
import { AdminWelcome } from './components/AdminWelcome';
import { AlertsPage } from './components/AlertsPage';
import { RealtimeNotifications } from './components/RealtimeNotifications';
import { Footer } from './components/Footer';
import { DataMigration } from './components/DataMigration';
import { supabaseService } from './services/supabaseService';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [donor, setDonor] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Fetch donor profile for realtime notifications
      if (userData.id && userData.role !== 'admin') {
        supabaseService.getDonor(userData.id)
          .then(donorData => setDonor(donorData))
          .catch(console.error);
      }
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isLanguageMenuOpen]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'admin') {
      navigate('/admin-welcome');
    } else {
      navigate('/home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' }
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsLanguageMenuOpen(false);
  };

  const getNavTranslations = () => {
    const translations = {
      en: {
        home: 'Home',
        register: 'Register',
        request: 'Request Help',
        donors: 'Find Donors',
        about: 'About',
        contact: 'Contact',
        admin: 'Admin',
        dashboard: 'Dashboard',
        login: 'Login',
        logout: 'Logout',
        editProfile: 'Edit Profile'
      },
      hi: {
        home: 'होम',
        register: 'पंजीकरण',
        request: 'मदद मांगें',
        donors: 'दाता खोजें',
        about: 'हमारे बारे में',
        contact: 'संपर्क',
        admin: 'एडमिन',
        dashboard: 'डैशबोर्ड',
        login: 'लॉगिन',
        logout: 'लॉगआउट',
        editProfile: 'प्रोफाइल संपादित करें'
      },
      te: {
        home: 'హోమ్',
        register: 'నమోదు',
        request: 'సహాయం అభ్యర్థించండి',
        donors: 'దాతలను కనుగొనండి',
        about: 'గురించి',
        contact: 'సంప్రదించండి',
        admin: 'అడ్మిన్',
        dashboard: 'డాష్‌బోర్డ్',
        login: 'లాగిన్',
        logout: 'లాగ్అవుట్',
        editProfile: 'ప్రొఫైల్ సవరించండి'
      },
      ta: {
        home: 'முகப்பு',
        register: 'பதிவு செய்யுங்கள்',
        request: 'உதவி கேளுங்கள்',
        donors: 'நன்கொடையாளர்களைக் கண்டறியுங்கள்',
        about: 'பற்றி',
        contact: 'தொடர்பு',
        admin: 'நிர்வாகி',
        dashboard: 'டாஷ்போர்டு',
        login: 'உள்நுழைய',
        logout: 'வெளியேறு',
        editProfile: 'சுயவிவரத்தைத் திருத்து'
      },
      ml: {
        home: 'ഹോം',
        register: 'രജിസ്റ്റർ ചെയ്യുക',
        request: 'സഹായം അഭ്യർത്ഥിക്കുക',
        donors: 'ദാതാക്കളെ കണ്ടെത്തുക',
        about: 'കുറിച്ച്',
        contact: 'ബന്ധപ്പെടുക',
        admin: 'അഡ്മിൻ',
        dashboard: 'ഡാഷ്ബോർഡ്',
        login: 'ലോഗിൻ',
        logout: 'ലോഗൗട്ട്',
        editProfile: 'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക'
      },
      kn: {
        home: 'ಮುಖಪುಟ',
        register: 'ನೋಂದಣಿ',
        request: 'ಸಹಾಯ ಕೋರಿ',
        donors: 'ದಾನಿಗಳನ್ನು ಹುಡುಕಿ',
        about: 'ಬಗ್ಗೆ',
        contact: 'ಸಂಪರ್ಕಿಸಿ',
        admin: 'ಅಡ್ಮಿನ್',
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        login: 'ಲಾಗಿನ್',
        logout: 'ಲಾಗೌಟ್',
        editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ'
      }
    };
    return translations[language] || translations.en;
  };

  const t = getNavTranslations();

  const getNavItems = () => {
    if (user && user.role === 'admin') {
      return [
        { path: '/home', label: t.home, icon: Home },
        { path: '/feedback', label: 'Feedback', icon: MessageSquare },
        { path: '/admin', label: t.admin, icon: BarChart3 },
      ];
    }
    
    const items = [
      { path: '/home', label: t.home, icon: Home },
      { path: '/register', label: t.register, icon: UserPlus },
      { path: '/request', label: t.request, icon: Phone },
      { path: '/donors', label: t.donors, icon: Users },
      { path: '/about', label: t.about, icon: Info },
      { path: '/contact', label: t.contact, icon: Mail },
    ];
    
    if (user) {
      items.push({ path: '/dashboard', label: t.dashboard, icon: BarChart3 });
      items.push({ path: '/alerts', label: '', icon: Bell, iconOnly: true });
    }
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to={user ? "/home" : "/"} className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-600" />
                <span className="text-2xl font-bold text-gray-900">LifeLink</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path} icon={item.icon} iconOnly={item.iconOnly}>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Right side buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative" ref={languageMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    className="flex items-center space-x-1"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{languages.find(l => l.code === language)?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  {isLanguageMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-50">
                      <div className="py-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              language === lang.code ? 'bg-red-50 text-red-600' : 'text-gray-700'
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate('/edit-profile');
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {t.editProfile}
                          </button>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            {t.logout}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button size="sm" className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{t.login}</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label || (item.path === '/alerts' ? 'Alerts' : '')}
                  </MobileNavLink>
                ))}
                
                <div className="border-t pt-2 mt-2">
                  <div className="mb-2">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Language</div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                          language === lang.code ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>

                  {user ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/edit-profile');
                        }}
                        className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t.editProfile}
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t.logout}
                      </button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        {t.login}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Realtime Notifications */}
        {user && donor && (
          <RealtimeNotifications user={user} donor={donor} />
        )}

        {/* Sticky Emergency Button - visible on all pages except auth */}
        <StickyEmergencyButton />

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Auth language={language} onLogin={handleLogin} />} />
            <Route path="/home" element={<HomePage language={language} user={user} />} />
            <Route path="/register" element={<RegisterPage language={language} user={user} />} />
            <Route path="/request" element={<RequestHelpPage language={language} user={user} />} />
            <Route path="/donors" element={<MapPage language={language} user={user} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/migrate" element={<DataMigration />} />
            <Route path="/alerts" element={user ? <AlertsPage language={language} user={user} /> : <Auth language={language} onLogin={handleLogin} />} />
            <Route path="/feedback" element={<FeedbackPage language={language} user={user} />} />
            <Route path="/auth" element={<Auth language={language} onLogin={handleLogin} />} />
            <Route path="/edit-profile" element={user ? <EditProfile user={user} onUpdateUser={handleUpdateUser} language={language} /> : <Auth language={language} onLogin={handleLogin} />} />
            
            {user && (
              <>
                <Route path="/dashboard" element={<Dashboard language={language} user={user} />} />
                {user.role === 'admin' && (
                  <>
                    <Route path="/admin-welcome" element={<AdminWelcome user={user} />} />
                    <Route path="/admin" element={<AdminPanel language={language} user={user} />} />
                  </>
                )}
              </>
            )}
          </Routes>
        </main>
        
        <Footer />
    </div>
  );
}

// Navigation Link Component
function NavLink({ to, children, icon: Icon, iconOnly = false }) {
  const location = useLocation();
  const isActive = location.pathname === to && location.pathname !== '/';
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (to === '/alerts') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const donors = JSON.parse(localStorage.getItem('donors') || '[]');
        const userDonor = donors.find((donor: any) => donor.userId === user.id);
        
        if (userDonor) {
          const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
          const responses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
          const respondedIds = responses.map((r: any) => r.requestId);
          
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
          
          const compatibleGroups = compatibility[userDonor.bloodGroup] || [];
          const newAlerts = bloodRequests.filter((request: any) => 
            compatibleGroups.includes(request.bloodGroup) &&
            !respondedIds.includes(request.id) &&
            request.status === 'active'
          );
          
          setAlertCount(newAlerts.length);
        }
      }
    }
  }, [to]);

  if (iconOnly) {
    return (
      <Link
        to={to}
        className={`flex items-center justify-center p-2 rounded-md transition-colors relative ${
          isActive
            ? 'text-red-600 bg-red-50'
            : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        <Icon className="h-5 w-5" />
        {to === '/alerts' && alertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
            {alertCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
        isActive
          ? 'text-red-600 bg-red-50'
          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, children, icon: Icon, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to && location.pathname !== '/';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive
          ? 'text-red-600 bg-red-50'
          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
}

// Emergency Button - fixed to top-right corner of the navbar area
function StickyEmergencyButton() {
  const location = useLocation();
  const hideOn = ['/', '/auth'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <>
      <style>{`
        @keyframes emergencyPulse {
          0%   { box-shadow: 0 0 0 0 rgba(220,38,38,0.7); }
          70%  { box-shadow: 0 0 0 10px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
      `}</style>
      <Link
        to="/request"
        className="fixed top-3 right-4 z-[100] flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-full shadow-lg text-xs transition-colors duration-200"
        style={{ animation: 'emergencyPulse 2s infinite' }}
      >
        <span>🚨</span>
        <span>Need Blood?</span>
      </Link>
    </>
  );
}

export default App;