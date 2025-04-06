import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthState,
  User,
  Organization,
  LoginCredentials,
  SignUpCredentials,
  SubscriptionTier,
} from "@/types/user";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (tier: SubscriptionTier) => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  organizationName: string;
  subscriptionTier: SubscriptionTier;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const mockUser: User = {
  id: "1",
  email: "dev@example.com",
  name: "Development User",
  role: "SUPER_ADMIN",
  organizationId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOrganization: Organization = {
  id: "1",
  name: "Development Organization",
  subscriptionTier: "PRO",
  subscriptionStatus: "ACTIVE",
  maxUsers: 10,
  currentUsers: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(mockUser);
  const [organization, setOrganization] = useState<Organization | null>(
    mockOrganization
  );
  const [isLoading, setIsLoading] = useState(false);

  // For development, we'll skip the session check
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const signUp = async (data: SignUpData) => {
    // For development, just set the mock user
    setUser(mockUser);
    setOrganization(mockOrganization);
    navigate("/dashboard");
  };

  const login = async (email: string, password: string) => {
    // For development, just set the mock user
    setUser(mockUser);
    setOrganization(mockOrganization);
    navigate("/dashboard");
  };

  const logout = async () => {
    // For development, we'll keep the user logged in
    navigate("/");
  };

  const updateSubscription = async (tier: SubscriptionTier) => {
    // For development, just update the mock organization
    setOrganization({
      ...mockOrganization,
      subscriptionTier: tier,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isLoading,
        signUp,
        login,
        logout,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
