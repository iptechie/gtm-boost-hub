export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "admin" | "org_admin" | "user";
          organization_id: string | null;
          subscription_tier: "free" | "basic" | "professional" | "enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: "admin" | "org_admin" | "user";
          organization_id?: string | null;
          subscription_tier: "free" | "basic" | "professional" | "enterprise";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: "admin" | "org_admin" | "user";
          organization_id?: string | null;
          subscription_tier?: "free" | "basic" | "professional" | "enterprise";
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          subscription_tier: "free" | "basic" | "professional" | "enterprise";
          max_users: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          subscription_tier: "free" | "basic" | "professional" | "enterprise";
          max_users: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subscription_tier?: "free" | "basic" | "professional" | "enterprise";
          max_users?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string | null;
          tier: "free" | "basic" | "professional" | "enterprise";
          status: "active" | "inactive" | "cancelled";
          start_date: string;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          organization_id?: string | null;
          tier: "free" | "basic" | "professional" | "enterprise";
          status: "active" | "inactive" | "cancelled";
          start_date: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string | null;
          tier?: "free" | "basic" | "professional" | "enterprise";
          status?: "active" | "inactive" | "cancelled";
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
