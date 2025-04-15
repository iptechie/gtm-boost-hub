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
import {
  supabase,
  handleOAuthCallback,
  checkAndInitializeUserWorkspace,
  signInWithEmail,
  signInWithProvider,
  signOut as supabaseSignOut,
  signUpWithEmail,
} from "@/lib/supabase";
import { Provider } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: Provider) => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session and set up auth state listener
  useEffect(() => {
    setIsLoading(true);

    // Initial session check
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        // Check and initialize workspace for the user if they don't have one yet
        await checkAndInitializeUserWorkspace();

        // Get user details and set the state with correct types
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          name:
            data.session.user.user_metadata.full_name ||
            data.session.user.user_metadata.name ||
            "User",
          role: "ADMIN" as const, // Cast to the correct User.role type
          organizationId: null,
          createdAt: new Date(data.session.user.created_at),
          updatedAt: new Date(),
        };

        setUser(userData);
        // You would also fetch organization data here
      } else {
        setUser(null);
        setOrganization(null);
      }

      setIsLoading(false);
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);

        if (event === "SIGNED_IN") {
          if (session) {
            // Check and initialize workspace for newly signed in user
            await checkAndInitializeUserWorkspace();

            // Update user state with correct types
            const userData: User = {
              id: session.user.id,
              email: session.user.email || "",
              name:
                session.user.user_metadata.full_name ||
                session.user.user_metadata.name ||
                "User",
              role: "ADMIN" as const, // Cast to the correct User.role type
              organizationId: null,
              createdAt: new Date(session.user.created_at),
              updatedAt: new Date(),
            };

            setUser(userData);
            // Fetch and set organization data
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setOrganization(null);
        }
      }
    );

    // Clean up the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Update login function to use Supabase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) throw error;

      // User state will be updated by the auth listener
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Implement social sign-in with the correct Provider type
  const socialLogin = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { data, error } = await signInWithProvider(provider);

      if (error) throw error;

      // OAuth flow continues in redirect - state will be updated by auth listener when user returns
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update logout function to use Supabase
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseSignOut();

      if (error) throw error;

      // User state will be updated by the auth listener
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { email, password, name, organizationName } = data;
      const userType = organizationName ? "company" : "single";

      const { data: authData, error } = await signUpWithEmail(
        email,
        password,
        userType,
        {
          name,
          organizationName,
        }
      );

      if (error) throw error;

      // After successful sign-up, redirect to login or confirmation page
      navigate("/login", {
        state: {
          message: "Please check your email to confirm your account.",
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (tier: SubscriptionTier) => {
    // Simplified implementation - just log the intent to update
    console.log(`Subscription update requested to tier: ${tier}`);
    // In a real implementation, this would call the appropriate Supabase functions
    // and update the local state
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isLoading,
        signUp,
        login,
        socialLogin,
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
