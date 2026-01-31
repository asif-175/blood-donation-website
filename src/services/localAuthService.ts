// Simple localStorage-based auth service as fallback
export const localAuthService = {
  async signUp(email: string, password: string, userData: { name: string; phone?: string; city?: string }) {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find((u: any) => u.email === email)) {
      throw new Error('User already registered');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this should be hashed
      ...userData,
      role: 'donor',
      created_at: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    return { user: newUser };
  },

  async signIn(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }

    return { user };
  },

  async getProfile(userId: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((u: any) => u.id === userId) || null;
  }
};