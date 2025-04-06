import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for user management
export const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data;
};

export const updateUser = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from("users")
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
