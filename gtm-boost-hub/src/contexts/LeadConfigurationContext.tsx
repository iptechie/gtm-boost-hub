import React, { createContext, useContext, useState, useEffect } from "react";
import { LeadConfiguration } from "@/types/lead";

interface LeadConfigurationContextType {
  configuration: LeadConfiguration;
  updateConfiguration: (config: LeadConfiguration) => void;
  isLoading: boolean;
}

const defaultConfiguration: LeadConfiguration = {
  statuses: [
    "New",
    "Contacted",
    "Qualified",
    "Discovery Meeting",
    "Demo Meeting",
    "RFP",
    "Proposal",
    "Closed Won",
    "Closed Lost",
  ],
  categories: ["Enterprise", "Mid-Market", "SMB", "Startup"],
  industries: [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Services",
  ],
  sources: [
    "Website",
    "LinkedIn",
    "Referral",
    "Cold Outreach",
    "Event",
    "Partner",
  ],
  timelines: [
    "Immediate",
    "1 week",
    "2 weeks",
    "1 month",
    "3 months",
    "6 months",
  ],
};

const LeadConfigurationContext = createContext<LeadConfigurationContextType>({
  configuration: defaultConfiguration,
  updateConfiguration: () => {},
  isLoading: true,
});

export const useLeadConfiguration = () => {
  const context = useContext(LeadConfigurationContext);
  if (!context) {
    throw new Error(
      "useLeadConfiguration must be used within a LeadConfigurationProvider"
    );
  }
  return context;
};

export const LeadConfigurationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [configuration, setConfiguration] =
    useState<LeadConfiguration>(defaultConfiguration);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem("leadConfiguration");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfiguration(parsedConfig);
      } catch (error) {
        console.error("Error loading lead configuration:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateConfiguration = (newConfig: LeadConfiguration) => {
    setConfiguration(newConfig);
    // Save to localStorage
    localStorage.setItem("leadConfiguration", JSON.stringify(newConfig));
  };

  return (
    <LeadConfigurationContext.Provider
      value={{
        configuration,
        updateConfiguration,
        isLoading,
      }}
    >
      {children}
    </LeadConfigurationContext.Provider>
  );
};

export default LeadConfigurationProvider;
