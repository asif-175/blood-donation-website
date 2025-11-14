# Blood Donation System - Supabase Integration

This project has been migrated from localStorage to Supabase backend with PostgreSQL database, authentication, storage, and realtime features.

## 🚀 Features Added

- **Supabase Authentication**: Secure user signup/login
- **PostgreSQL Database**: Structured data storage with relationships
- **Realtime Notifications**: Live alerts for new blood requests
- **File Upload**: Donor photo storage using Supabase Storage
- **Row Level Security**: Data protection and access control
- **Form Validation**: Enhanced UI with loading states and error handling

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Version 16 or higher
3. **Git**: For version control

## 🛠️ Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project
2. Go to **Settings > API** and copy:
   - Project URL
   - Anon public key
3. Run the SQL schema in **SQL Editor**:
   ```sql
   -- Copy and paste the contents of supabase-schema.sql
   ```

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Seeding (Optional)

To populate the database with sample data:

```javascript
// In browser console after running the app
import { migrateLocalStorageData, createTestUsers } from './src/utils/dataMigration';

// Seed sample blood requests
await migrateLocalStorageData();

// Create test users (optional)
await createTestUsers();
```

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🧪 Demo Steps

### 1. User Registration & Authentication
1. Visit the app and click "Create Account"
2. Fill in the registration form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Phone: +91-9876543210
   - City: Mumbai
3. Complete signup and login

### 2. Donor Registration
1. After login, you'll be redirected to donor registration
2. Fill in donor details:
   - Blood Group: O+
   - Age: 28
   - Weight: 70kg
   - Medical conditions: None
3. Submit the form

### 3. Dashboard Features
1. View your donor dashboard with:
   - Impact statistics
   - Donation history
   - Achievements
   - Accepted blood requests

### 4. Blood Request Creation
1. Go to "Request Help" page
2. Create a new blood request:
   - Patient Name: Emergency Patient
   - Blood Group: O+
   - Hospital: City Hospital
   - Urgency: Critical
3. Submit the request

### 5. Realtime Notifications
1. Open the app in two browser tabs
2. Create a blood request in one tab
3. See realtime notification appear in the other tab (if blood groups are compatible)

### 6. Alerts & Responses
1. Go to "Alerts" page (bell icon)
2. View compatible blood requests
3. Accept or decline requests
4. Check "Accepted Donations" in dashboard

## 🗄️ Database Schema

### Tables Created:
- `profiles` - User profiles extending Supabase auth
- `donors` - Donor-specific information
- `blood_requests` - Blood donation requests
- `donations` - Donation history
- `donor_responses` - Responses to blood requests

### Storage Buckets:
- `donor-photos` - Profile pictures for donors

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication required** for data modifications
- **Users can only modify their own data**
- **Public read access** for blood requests and donor listings

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Netlify Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Drag `dist` folder to Netlify
3. Or connect GitHub repository
4. Add environment variables in Netlify dashboard

## 🧪 Test Credentials

### Admin Access:
- Email: pathanasifkhan973@gmail.com
- Password: @Ak1705

### Test Donor Accounts:
- Email: donor1@example.com / Password: password123
- Email: donor2@example.com / Password: password123
- Email: donor3@example.com / Password: password123

## 🔧 Development

### Key Files:
- `src/services/supabaseService.ts` - Database operations
- `src/components/RealtimeNotifications.tsx` - Live notifications
- `src/utils/dataMigration.ts` - Data seeding utilities
- `supabase-schema.sql` - Database schema

### Available Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Common Issues:

1. **Authentication Errors**:
   - Check Supabase URL and keys in `.env`
   - Verify RLS policies are enabled

2. **Database Connection**:
   - Ensure schema is properly created
   - Check Supabase project status

3. **Realtime Not Working**:
   - Verify realtime is enabled in Supabase
   - Check browser console for errors

### Support:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review browser console for detailed error messages

## 📝 Backend: Supabase

This application uses Supabase as the backend service providing:
- PostgreSQL database
- Authentication & user management
- Real-time subscriptions
- File storage
- Row-level security