// Mock data for local development
export const mockData = {
  stats: {
    totalDonors: 1250,
    bloodUnitsCollected: 3400,
    livesImpacted: 10200,
    emergencyRequests: 45
  },
  
  urgentRequests: [
    {
      id: 1,
      patientName: 'John Smith',
      bloodGroup: 'O-',
      hospital: 'City General Hospital',
      unitsNeeded: 2,
      urgencyLevel: 'critical',
      createdAt: new Date().toISOString(),
      fulfilled: false
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      bloodGroup: 'A+',
      hospital: 'Metro Medical Center',
      unitsNeeded: 1,
      urgencyLevel: 'high',
      createdAt: new Date().toISOString(),
      fulfilled: false
    }
  ],
  
  successStories: [
    {
      id: 1,
      donorName: 'Mike Wilson',
      story: 'Thanks to this platform, I was able to help save a life during an emergency. The process was smooth and I felt great knowing I made a difference.',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      donorName: 'Lisa Chen',
      story: 'Being a regular donor has been rewarding. The platform makes it easy to connect with those in need.',
      createdAt: new Date().toISOString()
    }
  ]
};