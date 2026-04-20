import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Users, MapPin, Clock, Shield, Bell, CheckCircle, AlertTriangle, Droplets } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface HomePageProps {
  language: string;
  user: any;
}

export function HomePage({ language, user }: HomePageProps) {
  const [urgentRequests, setUrgentRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ donors: 0, requests: 0, lives: 0 });

  useEffect(() => {
    const requests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    const donors = JSON.parse(localStorage.getItem('donors') || '[]');
    const recent = requests
      .filter((r: any) => r.status === 'active')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setUrgentRequests(recent);
    setStats({
      donors: donors.length,
      requests: requests.length,
      lives: donors.length * 3
    });
  }, []);

  const urgencyColor = (level: string) => {
    if (level === 'critical') return 'bg-red-600';
    if (level === 'high') return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {user && (
            <p className="text-red-200 text-lg mb-2">
              Welcome back, <span className="font-bold text-white">{user.name}</span> 👋
            </p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
          >
            Someone Needs Blood <br />
            <span className="text-yellow-300">Right Now.</span>
          </motion.h1>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            LifeLink connects blood donors with patients in emergency. One donation saves up to 3 lives.
          </p>

          {/* TWO BIG CLEAR BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-xl font-bold px-10 py-6 rounded-2xl shadow-lg w-full sm:w-auto">
                <Heart className="h-6 w-6 mr-3" />
                I Want to Donate Blood
              </Button>
            </Link>
            <Link to="/request">
              <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 text-xl font-bold px-10 py-6 rounded-2xl shadow-lg w-full sm:w-auto">
                <AlertTriangle className="h-6 w-6 mr-3" />
                I Need Blood Urgently
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">How LifeLink Works</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Simple steps — for donors and patients both</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* FOR DONORS */}
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-red-500">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Heart className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">If You Want to Donate</h3>
              </div>
              <ol className="space-y-4">
                {[
                  { step: '1', text: 'Create a free account' },
                  { step: '2', text: 'Register your blood group & location' },
                  { step: '3', text: 'Get notified when someone nearby needs your blood' },
                  { step: '4', text: 'Call the patient and go donate — save a life!' },
                ].map(item => (
                  <li key={item.step} className="flex items-start">
                    <span className="bg-red-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <span className="text-gray-700 text-lg">{item.text}</span>
                  </li>
                ))}
              </ol>
              <Link to="/register" className="block mt-8">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                  Register as Donor
                </Button>
              </Link>
            </div>

            {/* FOR PATIENTS */}
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-yellow-400">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-7 w-7 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">If You Need Blood</h3>
              </div>
              <ol className="space-y-4">
                {[
                  { step: '1', text: 'Click "I Need Blood Urgently"' },
                  { step: '2', text: 'Fill in patient name, blood group & hospital' },
                  { step: '3', text: 'Nearby donors get notified instantly' },
                  { step: '4', text: 'Donors call you directly — help arrives fast!' },
                ].map(item => (
                  <li key={item.step} className="flex items-start">
                    <span className="bg-yellow-500 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <span className="text-gray-700 text-lg">{item.text}</span>
                  </li>
                ))}
              </ol>
              <Link to="/request" className="block mt-8">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg py-3 font-bold">
                  Request Blood Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE URGENT REQUESTS ── */}
      {urgentRequests.length > 0 && (
        <section className="py-10 px-4 bg-red-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <span className="h-3 w-3 bg-red-500 rounded-full animate-ping mr-2"></span>
              <h2 className="text-2xl font-bold text-gray-900">Live Blood Requests</h2>
            </div>
            <p className="text-center text-gray-500 mb-6 text-sm">These people need blood right now — can you help?</p>

            <div className="grid md:grid-cols-3 gap-6">
              {urgentRequests.map((req: any, i: number) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${urgencyColor(req.urgencyLevel)} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                      {req.urgencyLevel}
                    </span>
                    <span className="text-3xl font-extrabold text-red-600">{req.bloodGroup}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{req.patientName}</h4>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {req.hospital}, {req.city}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Droplets className="h-4 w-4 mr-1" />
                    {req.unitsNeeded} unit(s) needed
                  </div>
                  <a href={`tel:${req.phone}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/donors">
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-3">
                  View All Requests & Find Donors
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Our Community Impact</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: stats.donors, label: 'Registered Donors', icon: Users, color: 'text-blue-600' },
              { value: stats.requests, label: 'Blood Requests', icon: Bell, color: 'text-red-600' },
              { value: stats.lives, label: 'Lives Impacted', icon: Heart, color: 'text-green-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                <div className={`text-4xl font-extrabold ${item.color} mb-1`}>{item.value}+</div>
                <div className="text-gray-600 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DONATE ── */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Why Donate Blood?</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Every drop counts. Here's why your donation matters.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                color: 'bg-red-100 text-red-600',
                title: 'Save Up to 3 Lives',
                desc: 'One blood donation can be split into 3 components — red cells, plasma, and platelets — each saving a different life.'
              },
              {
                icon: Clock,
                color: 'bg-blue-100 text-blue-600',
                title: 'Takes Only 30 Minutes',
                desc: 'The actual donation takes just 8–10 minutes. The whole process including registration is under 30 minutes.'
              },
              {
                icon: Shield,
                color: 'bg-green-100 text-green-600',
                title: 'Free Health Check',
                desc: 'Before donating, you get a free mini health check — blood pressure, hemoglobin, pulse, and temperature.'
              },
              {
                icon: Users,
                color: 'bg-purple-100 text-purple-600',
                title: 'Anyone Can Need It',
                desc: 'Accidents, surgeries, cancer treatment, childbirth — blood is needed every 2 seconds in India.'
              },
              {
                icon: CheckCircle,
                color: 'bg-yellow-100 text-yellow-600',
                title: 'Safe & Painless',
                desc: 'Donating blood is completely safe. Your body replenishes the donated blood within 24–48 hours.'
              },
              {
                icon: Bell,
                color: 'bg-orange-100 text-orange-600',
                title: 'Priority in Emergency',
                desc: 'Registered donors on LifeLink get priority access to blood if they or their family ever need it.'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOOD GROUP COMPATIBILITY ── */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Blood Group Compatibility</h2>
          <p className="text-center text-gray-500 mb-6 text-sm">Know who you can donate to and receive from</p>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-3 rounded-tl-lg">Blood Group</th>
                  <th className="p-3">Can Donate To</th>
                  <th className="p-3 rounded-tr-lg">Can Receive From</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { group: 'O-', donateTo: 'Everyone (Universal Donor)', receiveFrom: 'O-' },
                  { group: 'O+', donateTo: 'O+, A+, B+, AB+', receiveFrom: 'O+, O-' },
                  { group: 'A-', donateTo: 'A-, A+, AB-, AB+', receiveFrom: 'A-, O-' },
                  { group: 'A+', donateTo: 'A+, AB+', receiveFrom: 'A+, A-, O+, O-' },
                  { group: 'B-', donateTo: 'B-, B+, AB-, AB+', receiveFrom: 'B-, O-' },
                  { group: 'B+', donateTo: 'B+, AB+', receiveFrom: 'B+, B-, O+, O-' },
                  { group: 'AB-', donateTo: 'AB-, AB+', receiveFrom: 'AB-, A-, B-, O-' },
                  { group: 'AB+', donateTo: 'AB+ only', receiveFrom: 'Everyone (Universal Receiver)' },
                ].map((row, i) => (
                  <tr key={row.group} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-extrabold text-red-600 text-lg">{row.group}</td>
                    <td className="p-3 text-gray-700">{row.donateTo}</td>
                    <td className="p-3 text-gray-700">{row.receiveFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-12 px-4 bg-gradient-to-br from-red-600 to-red-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-extrabold mb-3">Be Someone's Hero Today</h2>
          <p className="text-lg text-red-100 mb-8">
            It costs you nothing but 30 minutes. It means everything to someone fighting for their life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? '/register' : '/auth'}>
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-xl font-bold px-10 py-6 rounded-2xl w-full sm:w-auto">
                <Heart className="h-6 w-6 mr-3" />
                Donate Blood Now
              </Button>
            </Link>
            <Link to="/request">
              <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 text-xl font-bold px-10 py-6 rounded-2xl w-full sm:w-auto">
                <AlertTriangle className="h-6 w-6 mr-3" />
                Request Blood
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}