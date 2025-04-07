import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  OrganizationConfig,
  CustomField,
  DashboardLayout,
} from "@/types/config";
import { toast } from "sonner";

interface ConfigContextType {
  config: OrganizationConfig | null;
  isLoading: boolean;
  addCustomField: (field: Omit<CustomField, "id">) => Promise<void>;
  updateCustomField: (field: CustomField) => Promise<void>;
  deleteCustomField: (fieldId: string) => Promise<void>;
  addDashboardLayout: (layout: Omit<DashboardLayout, "id">) => Promise<void>;
  updateDashboardLayout: (layout: DashboardLayout) => Promise<void>;
  deleteDashboardLayout: (layoutId: string) => Promise<void>;
  updatePipelineStages: (stages: string[]) => Promise<void>;
  updateLeadCategories: (categories: string[]) => Promise<void>;
  updateIndustrySettings: (settings: { [key: string]: any }) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { organization } = useAuth();
  const [config, setConfig] = useState<OrganizationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (organization) {
      fetchConfig();
    }
  }, [organization]);

  const fetchConfig = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config`
      );
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Failed to fetch config:", error);
      toast.error("Failed to load configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomField = async (field: Omit<CustomField, "id">) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/fields`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(field),
        }
      );

      if (response.ok) {
        const newField = await response.json();
        setConfig((prev) => ({
          ...prev!,
          customFields: [...prev!.customFields, newField],
        }));
        toast.success("Custom field added successfully");
      } else {
        throw new Error("Failed to add custom field");
      }
    } catch (error) {
      console.error("Error adding custom field:", error);
      toast.error("Failed to add custom field");
      throw error;
    }
  };

  const updateCustomField = async (field: CustomField) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/fields/${field.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(field),
        }
      );

      if (response.ok) {
        const updatedField = await response.json();
        setConfig((prev) => ({
          ...prev!,
          customFields: prev!.customFields.map((f) =>
            f.id === field.id ? updatedField : f
          ),
        }));
        toast.success("Custom field updated successfully");
      } else {
        throw new Error("Failed to update custom field");
      }
    } catch (error) {
      console.error("Error updating custom field:", error);
      toast.error("Failed to update custom field");
      throw error;
    }
  };

  const deleteCustomField = async (fieldId: string) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/fields/${fieldId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setConfig((prev) => ({
          ...prev!,
          customFields: prev!.customFields.filter((f) => f.id !== fieldId),
        }));
        toast.success("Custom field deleted successfully");
      } else {
        throw new Error("Failed to delete custom field");
      }
    } catch (error) {
      console.error("Error deleting custom field:", error);
      toast.error("Failed to delete custom field");
      throw error;
    }
  };

  const addDashboardLayout = async (layout: Omit<DashboardLayout, "id">) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/layouts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(layout),
        }
      );

      if (response.ok) {
        const newLayout = await response.json();
        setConfig((prev) => ({
          ...prev!,
          dashboardLayouts: [...prev!.dashboardLayouts, newLayout],
        }));
        toast.success("Dashboard layout added successfully");
      } else {
        throw new Error("Failed to add dashboard layout");
      }
    } catch (error) {
      console.error("Error adding dashboard layout:", error);
      toast.error("Failed to add dashboard layout");
      throw error;
    }
  };

  const updateDashboardLayout = async (layout: DashboardLayout) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/layouts/${layout.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(layout),
        }
      );

      if (response.ok) {
        const updatedLayout = await response.json();
        setConfig((prev) => ({
          ...prev!,
          dashboardLayouts: prev!.dashboardLayouts.map((l) =>
            l.id === layout.id ? updatedLayout : l
          ),
        }));
        toast.success("Dashboard layout updated successfully");
      } else {
        throw new Error("Failed to update dashboard layout");
      }
    } catch (error) {
      console.error("Error updating dashboard layout:", error);
      toast.error("Failed to update dashboard layout");
      throw error;
    }
  };

  const deleteDashboardLayout = async (layoutId: string) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/layouts/${layoutId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setConfig((prev) => ({
          ...prev!,
          dashboardLayouts: prev!.dashboardLayouts.filter(
            (l) => l.id !== layoutId
          ),
        }));
        toast.success("Dashboard layout deleted successfully");
      } else {
        throw new Error("Failed to delete dashboard layout");
      }
    } catch (error) {
      console.error("Error deleting dashboard layout:", error);
      toast.error("Failed to delete dashboard layout");
      throw error;
    }
  };

  const updatePipelineStages = async (stages: string[]) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/pipeline-stages`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stages }),
        }
      );

      if (response.ok) {
        setConfig((prev) => ({
          ...prev!,
          pipelineStages: stages,
        }));
        toast.success("Pipeline stages updated successfully");
      } else {
        throw new Error("Failed to update pipeline stages");
      }
    } catch (error) {
      console.error("Error updating pipeline stages:", error);
      toast.error("Failed to update pipeline stages");
      throw error;
    }
  };

  const updateLeadCategories = async (categories: string[]) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/lead-categories`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories }),
        }
      );

      if (response.ok) {
        setConfig((prev) => ({
          ...prev!,
          leadCategories: categories,
        }));
        toast.success("Lead categories updated successfully");
      } else {
        throw new Error("Failed to update lead categories");
      }
    } catch (error) {
      console.error("Error updating lead categories:", error);
      toast.error("Failed to update lead categories");
      throw error;
    }
  };

  const updateIndustrySettings = async (settings: { [key: string]: any }) => {
    try {
      const response = await fetch(
        `/api/organizations/${organization?.id}/config/industry-settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        setConfig((prev) => ({
          ...prev!,
          industrySpecificSettings: settings,
        }));
        toast.success("Industry settings updated successfully");
      } else {
        throw new Error("Failed to update industry settings");
      }
    } catch (error) {
      console.error("Error updating industry settings:", error);
      toast.error("Failed to update industry settings");
      throw error;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        isLoading,
        addCustomField,
        updateCustomField,
        deleteCustomField,
        addDashboardLayout,
        updateDashboardLayout,
        deleteDashboardLayout,
        updatePipelineStages,
        updateLeadCategories,
        updateIndustrySettings,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
