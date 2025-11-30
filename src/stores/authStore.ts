import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinDate: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@bizness.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@bizness.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    joinDate: '2024-03-20',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string, role: UserRole) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          set({ user: existingUser, isAuthenticated: true });
          return true;
        }
        
        // Create new user for demo
        const newUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          joinDate: new Date().toISOString().split('T')[0],
        };
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      register: async (name: string, email: string, _password: string, role: UserRole) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          joinDate: new Date().toISOString().split('T')[0],
        };
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'bizness-auth',
    }
  )
);
