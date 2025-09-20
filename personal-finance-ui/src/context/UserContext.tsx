// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getAccessToken } from "../services/auth";
import type { User } from "../types/User";

interface UserContextProps {
  user: User | null;
  setUser: (u: User | null) => void;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch("http://localhost:8080/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch /me");
      const data: User = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching /me:", err);
    }
  };

  // Optionally fetch user on mount if token exists
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
