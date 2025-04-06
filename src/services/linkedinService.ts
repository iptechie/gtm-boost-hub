import { Lead, JobChange } from "@/types/lead";
import { currentMockLeads, updateMockLeads } from "@/mocks/mockData"; // Import mock leads

interface LinkedInProfile {
  company: string;
  title: string;
  lastUpdated: string;
}

class LinkedInService {
  private static instance: LinkedInService;
  private apiKey: string | null = null;
  // Use imported mock leads and add pending changes state
  private leads: Lead[] = currentMockLeads;
  private pendingJobChanges: JobChange[] = [];

  private constructor() {}

  static getInstance(): LinkedInService {
    if (!LinkedInService.instance) {
      LinkedInService.instance = new LinkedInService();
    }
    return LinkedInService.instance;
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  // In a real implementation, this would be a database operation
  setLeads(leads: Lead[]) {
    this.leads = leads; // Keep this for potential external updates if needed
    updateMockLeads(leads); // Also update the central mock store
  }

  // Method to set job changes
  setJobChanges(changes: JobChange[]) {
    this.pendingJobChanges = changes;
  }

  // Method to get pending job changes
  async getPendingJobChanges(): Promise<JobChange[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return the current list of pending changes
    return [...this.pendingJobChanges];
  }

  async checkProfileForChanges(lead: Lead): Promise<JobChange | null> {
    if (!lead.linkedinUrl || !this.apiKey) {
      return null;
    }

    try {
      // In a real implementation, this would call the LinkedIn API
      // For now, we'll simulate the API call
      const currentProfile = await this.getCurrentProfile(lead.linkedinUrl);

      if (!currentProfile) {
        return null;
      }

      // Check if there's a change in company or title
      if (
        currentProfile.company !== lead.company ||
        currentProfile.title !== lead.title
      ) {
        return {
          id: `change-${Date.now()}`,
          leadId: lead.id,
          previousCompany: lead.company,
          previousTitle: lead.title,
          newCompany: currentProfile.company,
          newTitle: currentProfile.title,
          changeDate: new Date().toISOString(),
          source: "LinkedIn",
          status: "Pending",
        };
      }

      return null;
    } catch (error) {
      console.error("Error checking LinkedIn profile:", error);
      return null;
    }
  }

  private async getCurrentProfile(
    url: string
  ): Promise<LinkedInProfile | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, this would:
    // 1. Extract the profile ID from the URL
    // 2. Call the LinkedIn API to get current profile data
    // 3. Parse and return the relevant information

    // Mock data for demonstration
    return {
      company: "New Company Inc",
      title: "Senior Developer",
      lastUpdated: new Date().toISOString(),
    };
  }

  async verifyJobChange(
    jobChange: JobChange
  ): Promise<{ success: boolean; updatedLead?: Lead }> {
    try {
      // Find the lead
      const leadIndex = this.leads.findIndex(
        (lead) => lead.id === jobChange.leadId
      );
      if (leadIndex === -1) {
        return { success: false };
      }

      // Update the lead's information
      const updatedLead = {
        ...this.leads[leadIndex],
        company: jobChange.newCompany,
        title: jobChange.newTitle,
        updatedAt: new Date().toISOString(),
      };

      // Update the central mock leads store
      const updatedLeads = [...this.leads];
      updatedLeads[leadIndex] = updatedLead;
      updateMockLeads(updatedLeads); // Update the central store
      this.leads = updatedLeads; // Update local reference

      // Update the job change status
      this.pendingJobChanges = this.pendingJobChanges.map((change) =>
        change.id === jobChange.id
          ? { ...change, status: "Verified" as const }
          : change
      );

      // In a real implementation, this would:
      // 1. Update the lead in the database
      // 2. Mark the job change as verified in the database

      return { success: true, updatedLead };
    } catch (error) {
      console.error("Error verifying job change:", error);
      return { success: false };
    }
  }

  async markAsFalsePositive(jobChange: JobChange): Promise<boolean> {
    try {
      // Update the job change status
      this.pendingJobChanges = this.pendingJobChanges.map((change) =>
        change.id === jobChange.id
          ? { ...change, status: "False Positive" as const }
          : change
      );

      // In a real implementation, this would:
      // 1. Mark the job change as a false positive in the database

      return true;
    } catch (error) {
      console.error("Error marking job change as false positive:", error);
      return false;
    }
  }
}

export const linkedinService = LinkedInService.getInstance();
