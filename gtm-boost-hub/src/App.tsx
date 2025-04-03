import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import FollowUpPage from "./pages/FollowUpPage"; // Import the new page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes outside the main layout */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/organization" element={<OrgAdminDashboard />} />
          <Route path="/admin/super" element={<SuperAdminDashboard />} />
          <Route path="/create-profile" element={<ProfileCreation />} />

          {/* Routes using the main layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/gtm-strategy" element={<GTMStrategyPage />} />
            <Route path="/mail-planner" element={<MailPlannerPage />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            <Route path="/follow-up" element={<FollowUpPage />} />{" "}
            {/* Add follow-up route */}
            {/* Add settings routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/settings/lead-scoring"
              element={<LeadScoringSettingsPage />}
            />
            <Route
              path="/settings/custom-lead-fields"
              element={<CustomLeadFieldsSettingsPage />}
            />
            <Route
              path="/settings/dashboard"
              element={<DashboardSettingsPage />}
            />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
