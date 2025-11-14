export const translations = {
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
        { title: "Fast Response", desc: "Emergency blood requests processed within minutes" },
        { title: "Verified Donors", desc: "All donors are verified with medical screening" },
        { title: "Community Impact", desc: "Building a network of life-savers across communities" },
        { title: "24/7 Support", desc: "Round-the-clock emergency assistance" }
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
        { title: "तेज़ प्रतिक्रिया", desc: "आपातकालीन रक्त अनुरोध मिनटों में संसाधित" },
        { title: "सत्यापित दाता", desc: "सभी दाता चिकित्सा जांच के साथ सत्यापित हैं" },
        { title: "सामुदायिक प्रभाव", desc: "समुदायों में जीवनदाताओं का नेटवर्क बनाना" },
        { title: "24/7 सपोर्ट", desc: "चौबीसों घंटे आपातकालीन सहायता" }
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

export const getWelcomeMessage = (language, userName) => {
  const messages = {
    en: `Welcome, ${userName}!`,
    hi: `स्वागत है, ${userName}!`
  };
  return messages[language] || messages.en;
};