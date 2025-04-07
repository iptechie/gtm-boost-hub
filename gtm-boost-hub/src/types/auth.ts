export type UserRole = "USER" | "ORG_ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = "BASIC" | "PRO" | "PREMIUM";
export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "EXPIRED" | "CANCELLED";

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
