"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  subscribe: (planId: string) => Promise<boolean>;
  cancelSubscription: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "zero_to_one_auth_user";
const USERS_STORAGE_KEY = "zero_to_one_registered_users";

// Pre-seeded demo user
const DEFAULT_DEMO_USER: User & { passwordHash: string } = {
  id: "demo_user_1",
  name: "Dr. Alex Vance",
  email: "alex@example.com",
  passwordHash: "password123",
  isSubscribed: false,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }

      // Ensure demo user exists in registered users table
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      }
    } catch {
      // LocalStorage unavailable / SSR fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulated network latency for realism
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!email || !password) {
      return { success: false, error: "Please provide both email and password." };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { passwordHash?: string }> = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_DEMO_USER];

      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!found) {
        return { success: false, error: "No account found with this email. Please register first." };
      }

      if (found.passwordHash && found.passwordHash !== password) {
        return { success: false, error: "Incorrect password. Try again or use demo credentials." };
      }

      const activeUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        isSubscribed: found.isSubscribed ?? false,
        plan: found.plan,
        createdAt: found.createdAt,
      };

      setUser(activeUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUser));
      return { success: true };
    } catch {
      return { success: false, error: "Authentication failed. Please try again." };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!name.trim()) {
      return { success: false, error: "Name is required." };
    }
    if (!email.trim() || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { passwordHash?: string }> = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_DEMO_USER];

      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: "An account with this email already exists. Please log in." };
      }

      const newUser: User & { passwordHash: string } = {
        id: "user_" + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: password,
        isSubscribed: false,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      const activeUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isSubscribed: false,
        createdAt: newUser.createdAt,
      };

      setUser(activeUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUser));
      return { success: true };
    } catch {
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const subscribe = async (planId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!user) return false;

    const updatedUser: User = {
      ...user,
      isSubscribed: true,
      plan: planId,
    };

    setUser(updatedUser);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

      // Update in registered users list as well
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (rawUsers) {
        const users: User[] = JSON.parse(rawUsers);
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], isSubscribed: true, plan: planId };
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
    } catch {
      // ignore
    }

    return true;
  };

  const cancelSubscription = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      isSubscribed: false,
      plan: undefined,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        subscribe,
        cancelSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
