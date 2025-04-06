import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { LeadConfigurationProvider } from "./contexts/LeadConfigurationContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import MainLayout from "./layouts/MainLayout"; // Import the new layout
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import LeadsPage from "./pages/LeadsPage";
import PipelinePage from "./pages/PipelinePage";
import GTMStrategyPage from "./pages/GTMStrategyPage";
import MailPlannerPage from "./pages/MailPlannerPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import SettingsPage from "./pages/SettingsPage"; // Import the general settings page
import LeadScoringSettingsPage from "./pages/LeadScoringSettingsPage";
import CustomLeadFieldsSettingsPage from "./pages/CustomLeadFieldsSettingsPage"; // Import Custom Lead Fields settings
import DashboardSettingsPage from "./pages/DashboardSettingsPage"; // Import Dashboard settings
import OrgAdminDashboard from "./pages/OrgAdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ProfileCreation from "./pages/ProfileCreation";
import ProfilePage from "./pages/ProfilePage"; // Import the new profile page
import FollowUpPage from "./pages/FollowUpPage"; // Import the new page
import NotFound from "./pages/NotFound";
import Settings from "@/pages/Settings";
import EmailIntegrationsPage from "./pages/EmailIntegrationsPage"; // Import the email integrations page
import LeadDetailPage from "./pages/LeadDetailPage"; // Import the lead detail page
import ReportsPage from "./pages/ReportsPage";
import { Provider } from "jotai";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // For development, always allow access
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // For development, always allow access
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Provider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ConfigProvider>
              <LeadConfigurationProvider>
                <SubscriptionProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected Routes */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/leads" element={<LeadsPage />} />
                      <Route
                        path="/leads/:leadId"
                        element={<LeadDetailPage />}
                      />
                      <Route path="/pipeline" element={<PipelinePage />} />
                      <Route
                        path="/gtm-strategy"
                        element={<GTMStrategyPage />}
                      />
                      <Route
                        path="/mail-planner"
                        element={<MailPlannerPage />}
                      />
                      <Route path="/ai-insights" element={<AIInsightsPage />} />
                      <Route path="/follow-up" element={<FollowUpPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route
                        path="/email-integrations"
                        element={<EmailIntegrationsPage />}
                      />
                      {/* Add settings routes */}
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings/lead-scoring"
                        element={<LeadScoringSettingsPage />}
                      />
                      <Route
                        path="/settings/custom-fields"
                        element={<CustomLeadFieldsSettingsPage />}
                      />
                      <Route
                        path="/settings/dashboard"
                        element={<DashboardSettingsPage />}
                      />
                      <Route path="/reports" element={<ReportsPage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                      element={
                        <AdminRoute>
                          <MainLayout />
                        </AdminRoute>
                      }
                    >
                      <Route
                        path="/admin/org"
                        element={<OrgAdminDashboard />}
                      />
                      <Route
                        path="/admin/super"
                        element={<SuperAdminDashboard />}
                      />
                    </Route>

                    {/* Profile Creation Route */}
                    <Route
                      path="/profile-creation"
                      element={<ProfileCreation />}
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SubscriptionProvider>
              </LeadConfigurationProvider>
            </ConfigProvider>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
