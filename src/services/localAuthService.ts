// Simple localStorage-based auth service as fallback when Supabase is unavailable

const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const safeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const localAuthService = {
  async signUp(email: string, password: string, userData: { name: string; phone?: string; city?: string }) {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find((u: any) => u.email === email)) {
      throw new Error('User already registered');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      ...userData,
      role: 'donor',
      created_at: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    return { user: { ...newUser, password: undefined } };
  },

  async signIn(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email);

    if (!user) throw new Error('Invalid login credentials');

    const hashedInput = await hashPassword(password);
    if (!safeCompare(hashedInput, user.password)) {
      throw new Error('Invalid login credentials');
    }

    const { password: _, ...safeUser } = user;
    return { user: safeUser };
  },

  async getProfile(userId: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
};