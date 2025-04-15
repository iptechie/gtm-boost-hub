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
  try {
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

    if (error) {
      console.error(`${provider} sign in error:`, error);
      return { data: null, error };
    }

    // Note: For OAuth providers, we need to handle user workspace initialization
    // in a session callback since the user isn't immediately available
    // See handleAuthChange function below

    return { data, error };
  } catch (error) {
    console.error(`Unexpected error during ${provider} sign in:`, error);
    return { data: null, error };
  }
};

// New function to handle OAuth callback and initialize workspace if needed
export const handleOAuthCallback = async () => {
  try {
    // Exchange the auth code for a session
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (data.session) {
      // Check if the user was just created (is new)
      const { user } = data.session;

      // Check if this user already has a workspace
      const { data: existingWorkspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Only initialize for new users with no workspace
      if (!existingWorkspace) {
        // Get user details from auth metadata
        const userData: UserData = {
          id: user.id,
          email: user.email || "",
          full_name:
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            user.email?.split("@")[0] ||
            "User",
          organization_id: undefined,
        };

        // Initialize user dataspace
        await initializeUserDataspace(userData);
        console.log("User workspace initialized for OAuth user:", user.id);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    return { data: null, error };
  }
};

// Function to check session and initialize workspace if needed for existing auth session
export const checkAndInitializeUserWorkspace = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (data.session?.user) {
      const user = data.session.user;

      // Check if this user already has a workspace
      const { data: existingWorkspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Only initialize if no workspace exists
      if (!existingWorkspace) {
        // Get user details from auth metadata
        const userData: UserData = {
          id: user.id,
          email: user.email || "",
          full_name:
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            user.email?.split("@")[0] ||
            "User",
          organization_id: undefined,
        };

        // Initialize user dataspace
        await initializeUserDataspace(userData);
        console.log("User workspace initialized for existing user:", user.id);
      }
    }

    return { session: data.session, error: null };
  } catch (error) {
    console.error("Error checking and initializing user workspace:", error);
    return { session: null, error };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  userType: "single" | "company",
  userData?: {
    name?: string;
    organizationName?: string;
  }
) => {
  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
        full_name: userData?.name,
        organization_name: userData?.organizationName,
      },
      emailRedirectTo: getOAuthRedirectUrl(),
    },
  });

  // If signup is successful and we have additional data, create a record in the signup_details table
  if (!error && data.user && userData) {
    try {
      await supabase.from("signup_details").insert([
        {
          user_id: data.user.id,
          email: email,
          full_name: userData.name,
          organization_name: userData.organizationName,
          user_type: userType,
          created_at: new Date().toISOString(),
        },
      ]);

      // Initialize the user's dataspace with default workspace, dashboard, pipeline, etc.
      if (userData.name) {
        await initializeUserDataspace({
          id: data.user.id,
          email: email,
          full_name: userData.name,
          organization_id: undefined,
        });
      }
    } catch (detailsError) {
      console.error("Error saving additional signup details:", detailsError);
      // Continue with signup even if saving additional details fails
    }
  }

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
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

// Contact Sales form submissions
export interface ContactSalesFormData {
  fullName: string;
  workEmail: string;
  phoneNumber: string;
  jobTitle: string;
  companyName: string;
  companySize: string;
  industry: string;
  region: string;
  message: string;
}

export const submitContactSalesForm = async (
  formData: ContactSalesFormData
) => {
  const { data, error } = await supabase
    .from("contact_requests")
    .insert([
      {
        full_name: formData.fullName,
        work_email: formData.workEmail,
        phone_number: formData.phoneNumber,
        job_title: formData.jobTitle,
        company_name: formData.companyName,
        company_size: formData.companySize,
        industry: formData.industry,
        region: formData.region,
        message: formData.message,
        status: "new",
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

// Multi-tenant data isolation utilities
export interface UserData {
  id: string;
  email: string;
  full_name: string;
  organization_id?: string;
}

// Core function to initialize tables with proper RLS policies for a new user
export const initializeUserDataspace = async (user: UserData) => {
  try {
    // Create personal workspace for the user
    const workspaceData = {
      user_id: user.id,
      name: `${user.full_name}'s Workspace`,
      created_at: new Date().toISOString(),
    };

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert([workspaceData])
      .select()
      .single();

    if (workspaceError) throw workspaceError;

    // Create default boards, pipelines, etc. for the new user
    await Promise.all([
      createDefaultPipeline(user.id, workspace.id),
      createDefaultDashboard(user.id, workspace.id),
      createDefaultSettings(user.id),
    ]);

    return { workspace, error: null };
  } catch (error) {
    console.error("Error initializing user dataspace:", error);
    return { workspace: null, error };
  }
};

// Create a default pipeline for new users
const createDefaultPipeline = async (userId: string, workspaceId: string) => {
  // Default pipeline stages
  const defaultStages = [
    { name: "Lead", order: 1 },
    { name: "Qualified", order: 2 },
    { name: "Proposal", order: 3 },
    { name: "Negotiation", order: 4 },
    { name: "Closed Won", order: 5 },
    { name: "Closed Lost", order: 6 },
  ];

  // Create a default pipeline
  const { data: pipeline, error: pipelineError } = await supabase
    .from("pipelines")
    .insert([
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: "Default Sales Pipeline",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (pipelineError) throw pipelineError;

  // Create pipeline stages
  const stagesData = defaultStages.map((stage) => ({
    pipeline_id: pipeline.id,
    user_id: userId,
    name: stage.name,
    order: stage.order,
    created_at: new Date().toISOString(),
  }));

  await supabase.from("pipeline_stages").insert(stagesData);

  return pipeline;
};

// Create a default dashboard for new users
const createDefaultDashboard = async (userId: string, workspaceId: string) => {
  const { data: dashboard, error } = await supabase
    .from("dashboards")
    .insert([
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: "My Dashboard",
        layout: {
          widgets: [
            {
              id: "leads_overview",
              type: "leads_overview",
              position: { x: 0, y: 0, w: 6, h: 4 },
            },
            {
              id: "pipeline_health",
              type: "pipeline_health",
              position: { x: 6, y: 0, w: 6, h: 4 },
            },
            {
              id: "recent_activities",
              type: "recent_activities",
              position: { x: 0, y: 4, w: 12, h: 4 },
            },
          ],
        },
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return dashboard;
};

// Create default user settings
const createDefaultSettings = async (userId: string) => {
  const { data: settings, error } = await supabase
    .from("user_settings")
    .insert([
      {
        user_id: userId,
        notifications_enabled: true,
        email_notifications: true,
        theme: "light",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return settings;
};

// Function to get all data for a specific user
export const getUserData = async (userId: string) => {
  // This function will automatically apply RLS policies based on the authenticated user
  try {
    const [
      profileResult,
      workspacesResult,
      pipelinesResult,
      dashboardsResult,
      settingsResult,
      leadsResult,
    ] = await Promise.all([
      supabase.from("user_profiles").select("*").eq("id", userId).single(),
      supabase.from("workspaces").select("*").eq("user_id", userId),
      supabase
        .from("pipelines")
        .select("*, pipeline_stages(*)")
        .eq("user_id", userId),
      supabase.from("dashboards").select("*").eq("user_id", userId),
      supabase.from("user_settings").select("*").eq("user_id", userId).single(),
      supabase
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    return {
      profile: profileResult.data,
      workspaces: workspacesResult.data,
      pipelines: pipelinesResult.data,
      dashboards: dashboardsResult.data,
      settings: settingsResult.data,
      leads: leadsResult.data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error };
  }
};

// Define lead data interface
export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  stage_id?: string;
  pipeline_id?: string;
  source?: string;
  notes?: string;
  custom_fields?: Record<string, string | number | boolean | null>; // More specific than [key: string]: any
}

// Define dashboard update interface
export interface DashboardUpdate {
  name?: string;
  layout?: {
    widgets: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
    }>;
  };
  is_default?: boolean;
  updated_at?: string;
}

// Save lead data for a specific user
export const saveLeadData = async (userId: string, leadData: LeadData) => {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        ...leadData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { data, error };
};

// Additional helper functions for data operations
export const updateUserDashboard = async (
  userId: string,
  dashboardId: string,
  updates: DashboardUpdate
) => {
  const { data, error } = await supabase
    .from("dashboards")
    .update(updates)
    .eq("id", dashboardId)
    .eq("user_id", userId) // This ensures users can only update their own dashboards
    .select()
    .single();

  return { data, error };
};

// Define demo scheduling data interface
export interface DemoSchedulingData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  attendees: string;
  message?: string;
  date: string;
  time: string;
  timezone: string;
}

// Save demo scheduling data
export const submitDemoSchedulingRequest = async (
  formData: DemoSchedulingData
) => {
  const { data, error } = await supabase
    .from("demo_requests")
    .insert([
      {
        full_name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || null,
        attendees: formData.attendees,
        message: formData.message || null,
        requested_date: formData.date,
        requested_time: formData.time,
        timezone: formData.timezone,
        status: "new",
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};
