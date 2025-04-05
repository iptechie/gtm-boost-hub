import { SubscriptionTier } from "./subscription";

export type UserRole = "ADMIN" | "USER" | "SUPER_ADMIN" | "ORG_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "TRIAL" | "CANCELLED";

export interface Organization {
  id: string;
  name: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  organizationName: string;
  subscriptionTier: SubscriptionTier;
}

export interface OrganizationInvite {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  expiresAt: Date;
}
