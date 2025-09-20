// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getAccessToken, initAuth, isAuthenticated as checkIsAuthenticated, clearAuthState } from "../services/auth";
import type { User } from "../types/User";
import api from "../services/api";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface UserContextProps extends AuthState {
  setUser: (u: User | null) => void;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });

  const setUser = (user: User | null) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user
    }));
  };

  const fetchUser = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Initialize Auth0 client first
      await initAuth();
      
      // First check if user is authenticated with Auth0
      const authenticated = await checkIsAuthenticated();
      if (!authenticated) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
        return;
      }
      
      const token = await getAccessToken();
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
        return;
      }

      const { data } = await api.get<User>("/me");
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: data
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      
      // If it's a 401 error, the token might be expired
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as any).response;
        if (response?.status === 401) {
          console.log("Token expired, clearing auth state");
          clearAuthState();
        }
      }
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    }
  };

  // Fetch user on mount and set up initial auth state
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ 
      ...authState,
      setUser,
      fetchUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
