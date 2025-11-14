import React from 'react';
import { Heart, Shield, Users, Clock, Award, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

interface AboutPageProps {
  language: 'en' | 'hi';
}

export function AboutPage({ language }: AboutPageProps) {
  const translations = {
    en: {
      title: 'About Blood Donation',
      subtitle: 'Everything you need to know about saving lives through blood donation',
      sections: {
        importance: {
          title: 'Why Blood Donation Matters',
          content: 'Blood donation is one of the most significant contributions that a person can make towards the society. It is a life-saving act that helps countless patients during emergencies, surgeries, and treatments for various medical conditions.',
          stats: [
            { number: '1', text: 'donation can save up to 3 lives' },
            { number: '4.5M', text: 'Americans need blood transfusions yearly' },
            { number: '56 days', text: 'minimum gap between donations' },
            { number: '15 mins', text: 'average donation time' }
          ]
        },
        benefits: {
          title: 'Benefits of Blood Donation',
          points: [
            { icon: Heart, title: 'Health Benefits', desc: 'Regular donation helps maintain healthy iron levels and may reduce heart disease risk' },
            { icon: Shield, title: 'Free Health Screening', desc: 'Get free health check-up including blood pressure, pulse, temperature, and hemoglobin' },
            { icon: Award, title: 'Recognition', desc: 'Receive donor certificates and badges for your contribution to society' },
            { icon: Users, title: 'Community Impact', desc: 'Directly contribute to saving lives in your community and beyond' }
          ]
        },
        eligibility: {
          title: 'Donor Eligibility Criteria',
          criteria: [
            { eligible: true, text: 'Age between 18-65 years' },
            { eligible: true, text: 'Weight minimum 50 kg (110 lbs)' },
            { eligible: true, text: 'Good general health' },
            { eligible: true, text: 'Normal temperature, blood pressure, and pulse' },
            { eligible: true, text: 'Hemoglobin level: Men ≥13.5 g/dL, Women ≥12.5 g/dL' },
            { eligible: false, text: 'Recent tattoo or piercing (wait 3 months)' },
            { eligible: false, text: 'Pregnancy or breastfeeding' },
            { eligible: false, text: 'Recent illness or infection' },
            { eligible: false, text: 'Certain medications or medical conditions' }
          ]
        },
        process: {
          title: 'Donation Process',
          steps: [
            { step: 1, title: 'Registration', desc: 'Complete donor registration form and ID verification' },
            { step: 2, title: 'Health Screening', desc: 'Mini health exam including vitals and hemoglobin check' },
            { step: 3, title: 'Medical History', desc: 'Brief interview about health history and lifestyle' },
            { step: 4, title: 'Donation', desc: 'Actual blood collection (8-10 minutes)' },
            { step: 5, title: 'Recovery', desc: 'Rest and refreshments for 10-15 minutes' }
          ]
        },
        types: {
          title: 'Types of Blood Donation',
          types: [
            { name: 'Whole Blood', duration: '8-10 mins', frequency: 'Every 56 days', desc: 'Most common type, collects all blood components' },
            { name: 'Platelets', duration: '70-90 mins', frequency: 'Every 7 days (24x/year)', desc: 'Essential for cancer patients and trauma victims' },
            { name: 'Plasma', duration: '50-60 mins', frequency: 'Every 28 days', desc: 'Used for burn victims, trauma patients, and immune disorders' },
            { name: 'Double Red Cells', duration: '25-35 mins', frequency: 'Every 112 days', desc: 'Collects concentrated red blood cells' }
          ]
        },
        compatibility: {
          title: 'Blood Type Compatibility',
          groups: [
            { type: 'O-', canGiveTo: ['All blood types'], canReceiveFrom: ['O-'], universal: 'Universal Donor' },
            { type: 'O+', canGiveTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
            { type: 'A-', canGiveTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
            { type: 'A+', canGiveTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
            { type: 'B-', canGiveTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
            { type: 'B+', canGiveTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
            { type: 'AB-', canGiveTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
            { type: 'AB+', canGiveTo: ['AB+'], canReceiveFrom: ['All blood types'], universal: 'Universal Recipient' }
          ]
        },
        myths: {
          title: 'Common Myths vs Facts',
          items: [
            { myth: 'Blood donation is painful', fact: 'You may feel a slight pinch, but the process is relatively painless' },
            { myth: 'Donation makes you weak', fact: 'Your body replaces the donated blood within 24-48 hours' },
            { myth: 'You can get diseases from donating', fact: 'All equipment is sterile and single-use - completely safe' },
            { myth: 'Certain blood types aren\'t needed', fact: 'All blood types are needed, especially O-negative' },
            { myth: 'Older people can\'t donate', fact: 'Healthy individuals up to 65 years can donate regularly' }
          ]
        },
        tips: {
          title: 'Before and After Donation Tips',
          before: [
            'Get a good night\'s sleep (7-8 hours)',
            'Eat a healthy, iron-rich meal',
            'Drink plenty of water (16 oz extra)',
            'Avoid alcohol 24 hours before',
            'Bring valid ID and donor card'
          ],
          after: [
            'Keep bandage on for 4-6 hours',
            'Avoid heavy lifting for 24 hours',
            'Drink extra fluids for 48 hours',
            'Eat iron-rich foods',
            'Contact us if you feel unwell'
          ]
        }
      }
    },
    hi: {
      title: 'रक्तदान के बारे में',
      subtitle: 'रक्तदान के माध्यम से जीवन बचाने के बारे में वह सब कुछ जो आपको जानना चाहिए',
      sections: {
        importance: {
          title: 'रक्तदान क्यों महत्वपूर्ण है',
          content: 'रक्तदान समाज के प्रति एक व्यक्ति का सबसे महत्वपूर्ण योगदान है। यह एक जीवनरक्षक कार्य है जो आपातकाल, सर्जरी और विभिन्न चिकित्सा स्थितियों के उपचार के दौरान अनगिनत रोगियों की मदद करता है।',
          stats: [
            { number: '1', text: 'दान से 3 जिंदगियां बच सकती हैं' },
            { number: '45 लाख', text: 'अमेरिकियों को वार्षिक रक्त आधान चाहिए' },
            { number: '56 दिन', text: 'दो दान के बीच न्यूनतम अंतराल' },
            { number: '15 मिनट', text: 'औसत दान समय' }
          ]
        },
        benefits: {
          title: 'रक्तदान के फायदे',
          points: [
            { icon: Heart, title: 'स्वास्थ्य लाभ', desc: 'नियमित दान स्वस्थ आयरन स्तर बनाए रखता है और हृदय रोग का जोखिम कम कर सकता है' },
            { icon: Shield, title: 'मुफ्त स्वास्थ्य जांच', desc: 'रक्तचाप, नाड़ी, तापमान और हीमोग्लोबिन सहित मुफ्त स्वास्थ्य जांच' },
            { icon: Award, title: 'पहचान', desc: 'समाज में आपके योगदान के लिए दाता प्रमाणपत्र और बैज प्राप्त करें' },
            { icon: Users, title: 'सामुदायिक प्रभाव', desc: 'अपने समुदाय और उससे आगे जीवन बचाने में प्रत्यक्ष योगदान दें' }
          ]
        },
        eligibility: {
          title: 'दाता पात्रता मानदंड',
          criteria: [
            { eligible: true, text: '18-65 वर्ष के बीच आयु' },
            { eligible: true, text: 'न्यूनतम 50 किग्रा वजन' },
            { eligible: true, text: 'अच्छा सामान्य स्वास्थ्य' },
            { eligible: true, text: 'सामान्य तापमान, रक्तचाप और नाड़ी' },
            { eligible: true, text: 'हीमोग्लोबिन स्तर: पुरुष ≥13.5 g/dL, महिला ≥12.5 g/dL' },
            { eligible: false, text: 'हाल ही में टैटू या छेदन (3 महीने प्रतीक्षा)' },
            { eligible: false, text: 'गर्भावस्था या स्तनपान' },
            { eligible: false, text: 'हाल की बीमारी या संक्रमण' },
            { eligible: false, text: 'कुछ दवाएं या चिकित्सा स्थितियां' }
          ]
        },
        process: {
          title: 'दान प्रक्रिया',
          steps: [
            { step: 1, title: 'पंजीकरण', desc: 'दाता पंजीकरण फॉर्म और पहचान सत्यापन पूरा करें' },
            { step: 2, title: 'स्वास्थ्य जांच', desc: 'वाइटल्स और हीमोग्लोबिन जांच सहित मिनी स्वास्थ्य परीक्षा' },
            { step: 3, title: 'चिकित्सा इतिहास', desc: 'स्वास्थ्य इतिहास और जीवनशैली के बारे में संक्षिप्त साक्षात्कार' },
            { step: 4, title: 'दान', desc: 'वास्तविक रक्त संग्रह (8-10 मिनट)' },
            { step: 5, title: 'रिकवरी', desc: '10-15 मिनट के लिए आराम और जलपान' }
          ]
        },
        types: {
          title: 'रक्तदान के प्रकार',
          types: [
            { name: 'संपूर्ण रक्त', duration: '8-10 मिनट', frequency: 'हर 56 दिन', desc: 'सबसे आम प्रकार, सभी रक्त घटकों को एकत्रित करता है' },
            { name: 'प्लेटलेट्स', duration: '70-90 मिनट', frequency: 'हर 7 दिन (24x/वर्ष)', desc: 'कैंसर रोगियों और आघात पीड़ितों के लिए आवश्यक' },
            { name: 'प्लाज्मा', duration: '50-60 मिनट', frequency: 'हर 28 दिन', desc: 'जलने, आघात रोगियों और प्रतिरक्षा विकारों के लिए उपयोग' },
            { name: 'डबल रेड सेल्स', duration: '25-35 मिनट', frequency: 'हर 112 दिन', desc: 'केंद्रित लाल रक्त कोशिकाओं को एकत्रित करता है' }
          ]
        },
        compatibility: {
          title: 'रक्त प्रकार संगतता',
          groups: [
            { type: 'O-', canGiveTo: ['सभी रक्त प्रकार'], canReceiveFrom: ['O-'], universal: 'सार्वभौमिक दाता' },
            { type: 'O+', canGiveTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
            { type: 'A-', canGiveTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
            { type: 'A+', canGiveTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
            { type: 'B-', canGiveTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
            { type: 'B+', canGiveTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
            { type: 'AB-', canGiveTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
            { type: 'AB+', canGiveTo: ['AB+'], canReceiveFrom: ['सभी रक्त प्रकार'], universal: 'सार्वभौमिक प्राप्तकर्ता' }
          ]
        },
        myths: {
          title: 'आम मिथक बनाम तथ्य',
          items: [
            { myth: 'रक्तदान दर्दनाक है', fact: 'आपको हल्का सा चुभन महसूस हो सकता है, लेकिन प्रक्रिया अपेक्षाकृत दर्द रहित है' },
            { myth: 'दान से आप कमजोर हो जाते हैं', fact: 'आपका शरीर 24-48 घंटों में दान किए गए रक्त को बदल देता है' },
            { myth: 'दान से बीमारी हो सकती है', fact: 'सभी उपकरण निष्फल और एकल उपयोग के हैं - पूरी तरह सुरक्षित' },
            { myth: 'कुछ रक्त प्रकारों की जरूरत नहीं', fact: 'सभी रक्त प्रकारों की जरूरत है, विशेष रूप से O-नकारात्मक' },
            { myth: 'बुजुर्ग लोग दान नहीं कर सकते', fact: '65 वर्ष तक के स्वस्थ व्यक्ति नियमित रूप से दान कर सकते हैं' }
          ]
        },
        tips: {
          title: 'दान से पहले और बाद की युक्तियां',
          before: [
            'अच्छी नींद लें (7-8 घंटे)',
            'स्वस्थ, आयरन युक्त भोजन करें',
            'खूब पानी पिएं (16 औंस अतिरिक्त)',
            '24 घंटे पहले शराब से बचें',
            'वैध पहचान और दाता कार्ड लाएं'
          ],
          after: [
            'पट्टी को 4-6 घंटे तक रखें',
            '24 घंटे तक भारी सामान उठाने से बचें',
            '48 घंटे तक अतिरिक्त तरल पदार्थ पिएं',
            'आयरन युक्त भोजन करें',
            'अगर आप अस्वस्थ महसूस करें तो हमसे संपर्क करें'
          ]
        }
      }
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Importance Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.importance.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {t.sections.importance.content}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {t.sections.importance.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-center p-6 bg-red-50 rounded-lg"
                  >
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.text}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Award className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.benefits.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {t.sections.benefits.points.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Eligibility Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.eligibility.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.sections.eligibility.criteria.map((criteria, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      criteria.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {criteria.eligible ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${criteria.eligible ? 'text-green-700' : 'text-red-700'}`}>
                      {criteria.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Process Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Clock className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.process.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {t.sections.process.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Blood Compatibility Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.compatibility.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {t.sections.compatibility.groups.map((group, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="destructive" className="text-lg px-3 py-1">
                        {group.type}
                      </Badge>
                      {group.universal && (
                        <Badge variant="secondary" className="text-xs">
                          {group.universal}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Can give to: </span>
                        <span className="text-sm text-gray-600">
                          {Array.isArray(group.canGiveTo) ? group.canGiveTo.join(', ') : group.canGiveTo}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Can receive from: </span>
                        <span className="text-sm text-gray-600">
                          {Array.isArray(group.canReceiveFrom) ? group.canReceiveFrom.join(', ') : group.canReceiveFrom}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Myths vs Facts Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <HelpCircle className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.myths.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {t.sections.myths.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-red-500 pl-6"
                  >
                    <div className="bg-red-50 p-4 rounded-lg mb-2">
                      <span className="text-sm font-medium text-red-800">Myth: </span>
                      <span className="text-sm text-red-700">{item.myth}</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Fact: </span>
                      <span className="text-sm text-green-700">{item.fact}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                {t.sections.tips.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Before Donation</h3>
                  <ul className="space-y-2">
                    {t.sections.tips.before.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">After Donation</h3>
                  <ul className="space-y-2">
                    {t.sections.tips.after.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}