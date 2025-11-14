import { supabaseService } from '../services/supabaseService';

// Sample data to seed the database
const sampleData = {
  // Sample blood requests
  bloodRequests: [
    {
      patient_name: 'John Smith',
      blood_group: 'O-' as const,
      units_needed: 2,
      urgency_level: 'critical' as const,
      hospital: 'City General Hospital',
      city: 'Mumbai',
      contact_person: 'Dr. Sarah Wilson',
      phone: '+91-9876543210',
      additional_notes: 'Emergency surgery required',
      status: 'active' as const
    },
    {
      patient_name: 'Maria Garcia',
      blood_group: 'A+' as const,
      units_needed: 1,
      urgency_level: 'high' as const,
      hospital: 'Metro Medical Center',
      city: 'Delhi',
      contact_person: 'Dr. Raj Patel',
      phone: '+91-9876543211',
      additional_notes: 'Accident victim needs immediate blood transfusion',
      status: 'active' as const
    },
    {
      patient_name: 'David Chen',
      blood_group: 'B+' as const,
      units_needed: 3,
      urgency_level: 'medium' as const,
      hospital: 'Apollo Hospital',
      city: 'Bangalore',
      contact_person: 'Dr. Priya Sharma',
      phone: '+91-9876543212',
      additional_notes: 'Scheduled surgery next week',
      status: 'active' as const
    },
    {
      patient_name: 'Lisa Johnson',
      blood_group: 'AB-' as const,
      units_needed: 1,
      urgency_level: 'high' as const,
      hospital: 'Fortis Hospital',
      city: 'Chennai',
      contact_person: 'Dr. Kumar Reddy',
      phone: '+91-9876543213',
      additional_notes: 'Rare blood type needed urgently',
      status: 'active' as const
    }
  ],

  // Sample user accounts for testing
  testUsers: [
    {
      email: 'donor1@example.com',
      password: 'password123',
      name: 'Alex Kumar',
      phone: '+91-9876543220',
      city: 'Mumbai',
      bloodGroup: 'O+',
      age: 28,
      weight: 70
    },
    {
      email: 'donor2@example.com',
      password: 'password123',
      name: 'Priya Sharma',
      phone: '+91-9876543221',
      city: 'Delhi',
      bloodGroup: 'A+',
      age: 32,
      weight: 55
    },
    {
      email: 'donor3@example.com',
      password: 'password123',
      name: 'Rahul Patel',
      phone: '+91-9876543222',
      city: 'Bangalore',
      bloodGroup: 'B-',
      age: 25,
      weight: 65
    }
  ]
};

export async function migrateLocalStorageData() {
  try {
    console.log('Starting data migration...');

    // Migrate blood requests
    console.log('Creating sample blood requests...');
    for (const request of sampleData.bloodRequests) {
      try {
        await supabaseService.createBloodRequest(request);
        console.log(`Created blood request for ${request.patient_name}`);
      } catch (error) {
        console.error(`Failed to create request for ${request.patient_name}:`, error);
      }
    }

    console.log('Data migration completed successfully!');
    return { success: true, message: 'Sample data has been seeded to Supabase' };

  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
}

export async function createTestUsers() {
  try {
    console.log('Creating test users...');

    for (const user of sampleData.testUsers) {
      try {
        // Sign up user
        const { user: authUser } = await supabaseService.signUp(
          user.email,
          user.password,
          {
            name: user.name,
            phone: user.phone,
            city: user.city
          }
        );

        if (authUser) {
          // Create donor profile
          await supabaseService.createDonor({
            user_id: authUser.id,
            blood_group: user.bloodGroup,
            age: user.age,
            weight: user.weight,
            is_available: true,
            address: `${user.city}, India`
          });

          console.log(`Created test user: ${user.name}`);
        }
      } catch (error) {
        console.error(`Failed to create user ${user.name}:`, error);
      }
    }

    console.log('Test users created successfully!');
    return { success: true, message: 'Test users have been created' };

  } catch (error) {
    console.error('Test user creation failed:', error);
    return { success: false, error: error.message };
  }
}

// Function to migrate existing localStorage data to Supabase
export async function migrateExistingLocalStorageData() {
  try {
    console.log('Migrating existing localStorage data...');

    // Get existing data from localStorage
    const userAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
    const donors = JSON.parse(localStorage.getItem('donors') || '[]');
    const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');

    // Migrate user accounts
    for (const account of userAccounts) {
      try {
        if (account.email && account.password && account.name) {
          await supabaseService.signUp(account.email, account.password, {
            name: account.name,
            phone: account.phone,
            city: account.city
          });
          console.log(`Migrated user: ${account.name}`);
        }
      } catch (error) {
        console.error(`Failed to migrate user ${account.name}:`, error);
      }
    }

    // Migrate blood requests
    for (const request of bloodRequests) {
      try {
        if (request.patientName && request.bloodGroup) {
          await supabaseService.createBloodRequest({
            patient_name: request.patientName,
            blood_group: request.bloodGroup,
            units_needed: request.unitsNeeded || 1,
            urgency_level: request.urgencyLevel || 'medium',
            hospital: request.hospital || 'Unknown Hospital',
            city: request.city || 'Unknown City',
            contact_person: request.contactPerson || 'Unknown',
            phone: request.phone || '+91-0000000000',
            additional_notes: request.additionalInfo,
            status: request.status || 'active'
          });
          console.log(`Migrated blood request for: ${request.patientName}`);
        }
      } catch (error) {
        console.error(`Failed to migrate blood request for ${request.patientName}:`, error);
      }
    }

    console.log('localStorage data migration completed!');
    return { success: true, message: 'Existing data has been migrated to Supabase' };

  } catch (error) {
    console.error('localStorage migration failed:', error);
    return { success: false, error: error.message };
  }
}