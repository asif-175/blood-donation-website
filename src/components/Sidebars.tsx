import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Droplets, Calendar, Megaphone, Info, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── DATA ───────────────────────────────────────────────────────────────────

const TOP_DONORS = [
  { rank: 1, name: 'Rahul Sharma',    city: 'Mumbai',    blood: 'O+',  donations: 24, badge: '🥇' },
  { rank: 2, name: 'Priya Patel',     city: 'Delhi',     blood: 'A+',  donations: 19, badge: '🥈' },
  { rank: 3, name: 'Arjun Reddy',     city: 'Hyderabad', blood: 'B+',  donations: 17, badge: '🥉' },
  { rank: 4, name: 'Sneha Iyer',      city: 'Chennai',   blood: 'AB+', donations: 14, badge: '⭐' },
  { rank: 5, name: 'Mohammed Ali',    city: 'Bangalore', blood: 'O-',  donations: 12, badge: '⭐' },
];

const BLOOD_AVAILABILITY = [
  { group: 'A+',  level: 85, status: 'Good' },
  { group: 'A-',  level: 30, status: 'Low' },
  { group: 'B+',  level: 70, status: 'Good' },
  { group: 'B-',  level: 20, status: 'Critical' },
  { group: 'AB+', level: 60, status: 'Moderate' },
  { group: 'AB-', level: 15, status: 'Critical' },
  { group: 'O+',  level: 90, status: 'Good' },
  { group: 'O-',  level: 25, status: 'Low' },
];

const BLOOD_CAMPS = [
  {
    title: 'City Blood Drive',
    date: 'Apr 25, 2026',
    time: '9:00 AM – 4:00 PM',
    location: 'Rajiv Gandhi Stadium, Hyderabad',
    organizer: 'Red Cross Society',
    spots: 120,
  },
  {
    title: 'Corporate Donation Camp',
    date: 'May 2, 2026',
    time: '10:00 AM – 3:00 PM',
    location: 'HITEC City, Hyderabad',
    organizer: 'LifeLink & TCS',
    spots: 80,
  },
  {
    title: 'College Blood Camp',
    date: 'May 10, 2026',
    time: '8:00 AM – 2:00 PM',
    location: 'Osmania University, Hyderabad',
    organizer: 'NSS Unit',
    spots: 200,
  },
];

const FACTS = [
  'Every 2 seconds, someone in India needs blood.',
  'One donation can save up to 3 lives.',
  'Only 7% of people have O- blood — the universal donor.',
  'Blood cannot be manufactured — it can only come from donors.',
  'A healthy adult can donate blood every 56 days.',
  'Donated blood has a shelf life of only 42 days.',
  'Platelets must be used within just 5 days of donation.',
  'AB+ is the universal plasma donor.',
];

// ─── LEFT SIDEBAR ────────────────────────────────────────────────────────────

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'donors' | 'blood'>('donors');

  const statusColor = (status: string) => {
    if (status === 'Good')     return 'bg-green-500';
    if (status === 'Moderate') return 'bg-yellow-500';
    if (status === 'Low')      return 'bg-orange-500';
    return 'bg-red-600';
  };

  const levelColor = (level: number) => {
    if (level >= 70) return 'bg-green-500';
    if (level >= 40) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <aside className="hidden xl:flex flex-col gap-4 w-56 shrink-0">

      {/* Tab Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab('donors')}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'donors' ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            🏆 Top Donors
          </button>
          <button
            onClick={() => setActiveTab('blood')}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'blood' ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            🩸 Blood Stock
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'donors' ? (
            <motion.div
              key="donors"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-3"
            >
              <p className="text-xs text-gray-400 mb-3">This Month's Heroes</p>
              <div className="space-y-2">
                {TOP_DONORS.map((donor) => (
                  <div key={donor.rank} className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <span className="text-base">{donor.badge}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{donor.name}</p>
                      <p className="text-xs text-gray-400">{donor.city} · <span className="text-red-600 font-bold">{donor.blood}</span></p>
                    </div>
                    <span className="text-xs font-bold text-red-600 shrink-0">{donor.donations}x</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <Link to="/register" className="text-xs text-red-600 hover:underline font-medium">
                  Join & become a hero →
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="blood"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-3"
            >
              <p className="text-xs text-gray-400 mb-3">Live Blood Bank Status</p>
              <div className="space-y-2">
                {BLOOD_AVAILABILITY.map((item) => (
                  <div key={item.group} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600 w-8 shrink-0">{item.group}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className={`h-2 rounded-full ${levelColor(item.level)}`}
                      />
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full text-white shrink-0 ${statusColor(item.status)}`}
                      style={{ fontSize: '9px' }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <Link to="/register" className="text-xs text-red-600 hover:underline font-medium">
                  Donate to replenish →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Did You Know */}
      <RotatingFact />
    </aside>
  );
}

// ─── RIGHT SIDEBAR ───────────────────────────────────────────────────────────

export function RightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-56 shrink-0">

      {/* Upcoming Blood Camps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-white" />
          <span className="text-white text-xs font-bold">Upcoming Blood Camps</span>
        </div>
        <div className="p-3 space-y-3">
          {BLOOD_CAMPS.map((camp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-red-100 rounded-lg p-2 hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer"
            >
              <p className="text-xs font-bold text-gray-900 mb-1">{camp.title}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span className="font-medium">{camp.date}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{camp.time}</span>
                </div>
                <div className="flex items-start gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                  <span className="leading-tight">{camp.location}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">{camp.organizer}</span>
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                  {camp.spots} spots
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="px-3 pb-3 text-center">
          <Link to="/register" className="text-xs text-red-600 hover:underline font-medium">
            Register to attend →
          </Link>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-3 text-white text-center shadow-md"
      >
        <div className="text-2xl mb-1">🚨</div>
        <p className="text-xs font-bold mb-1">O- Blood Critically Low</p>
        <p className="text-xs text-red-100 mb-2">Hospitals in Hyderabad urgently need O- donors</p>
        <Link to="/register">
          <button className="w-full bg-white text-red-600 text-xs font-bold py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            Donate Now
          </button>
        </Link>
      </motion.div>

    </aside>
  );
}

// ─── ROTATING FACT ───────────────────────────────────────────────────────────

function RotatingFact() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % FACTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-4 w-4 text-blue-600 shrink-0" />
        <span className="text-xs font-bold text-blue-700">Did You Know?</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-blue-800 leading-relaxed"
        >
          {FACTS[index]}
        </motion.p>
      </AnimatePresence>
      <div className="flex gap-1 mt-2 justify-center">
        {FACTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-4 bg-blue-600' : 'w-1.5 bg-blue-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}