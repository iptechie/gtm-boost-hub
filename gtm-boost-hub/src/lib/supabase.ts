import { createClient, Provider } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication types
export type AuthProvider = Provider;
export type UserRole = "admin" | "org_admin" | "user";
export type SubscriptionTier = "free" | "basic" | "professional" | "enterprise";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id?: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  subscription_tier: SubscriptionTier;
  max_users: number;
  created_at: string;
  updated_at: string;
}

// Helper function to get the appropriate redirect URL for OAuth
const getOAuthRedirectUrl = () => {
  // If we're in development, use localhost
  if (import.meta.env.DEV) {
    return `${window.location.origin}/auth/callback`;
  }
  // In production, use the Supabase URL
  return `${supabaseUrl}/auth/callback`;
};

// Authentication functions
export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getOAuthRedirectUrl(),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  userType: "single" | "company"
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
      },
      emailRedirectTo: getOAuthRedirectUrl(),
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// User profile functions
export const createUserProfile = async (
  profile: Omit<UserProfile, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([profile])
    .select()
    .single();
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

// Organization functions
export const createOrganization = async (
  org: Omit<Organization, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("organizations")
    .insert([org])
    .select()
    .single();
  return { data, error };
};

export const getOrganization = async (orgId: string) => {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
  return { data, error };
};

// Subscription functions
export const updateSubscription = async (
  userId: string,
  tier: SubscriptionTier
) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ subscription_tier: tier })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
};

export const updateOrgSubscription = async (
  orgId: string,
  tier: SubscriptionTier,
  maxUsers: number
) => {
  const { data, error } = await supabase
    .from("organizations")
    .update({ subscription_tier: tier, max_users: maxUsers })
    .eq("id", orgId)
    .select()
    .single();
  return { data, error };
};

// Helper functions for user management
export const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data;
};

export const updateUser = async (
  userId: string,
  updates: Partial<Database["public"]["Tables"]["user_profiles"]["Update"]>
) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
};

export const fetchOrganizations = async () => {
  const { data, error } = await supabase.from("organizations").select("*");

  if (error) throw error;
  return data;
};

export const fetchAdminStats = async () => {
  // Fetch total organizations
  const { count: orgCount, error: orgError } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true });

  if (orgError) throw orgError;

  // Fetch total users
  const { count: userCount, error: userError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (userError) throw userError;

  // Fetch active trials (organizations with trial status)
  const { count: trialCount, error: trialError } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "trial");

  if (trialError) throw trialError;

  // Calculate monthly revenue (this would be more complex in a real app)
  // For now, we'll use a placeholder
  const monthlyRevenue = 2450; // This would be calculated from subscription data

  return {
    totalOrganizations: orgCount || 0,
    totalUsers: userCount || 0,
    monthlyRevenue,
    activeTrials: trialCount || 0,
  };
};

export const fetchRecentOrganizations = async () => {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};
