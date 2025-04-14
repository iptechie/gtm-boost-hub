import { supabase } from "@/lib/supabase";
import { Lead } from "@/types/lead";

export interface EmailIntegration {
  id: string;
  provider: "microsoft" | "google" | "mailchimp";
  email: string;
  isConnected: boolean;
  lastSynced: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}

export interface EmailMessage {
  id: string;
  integrationId: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  receivedAt: string;
  read: boolean;
  starred: boolean;
  labels?: string[];
  attachments?: EmailAttachment[];
  sentiment?: "positive" | "negative" | "neutral";
  intent?: "interested" | "not_interested" | "needs_more_info" | "unknown";
  leadId?: string;
  score?: number;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface EmailAnalysisSettings {
  sentimentAnalysis: boolean;
  intentDetection: boolean;
  leadScoring: boolean;
  emailTemplates: boolean;
}

// Mock data for development
const mockIntegrations: EmailIntegration[] = [
  {
    id: "1",
    provider: "microsoft",
    email: "user@example.com",
    isConnected: false,
    lastSynced: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
  {
    id: "2",
    provider: "google",
    email: "user@gmail.com",
    isConnected: false,
    lastSynced: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
  {
    id: "3",
    provider: "mailchimp",
    email: "user@mailchimp.com",
    isConnected: false,
    lastSynced: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
];

const mockEmails: EmailMessage[] = [
  {
    id: "1",
    integrationId: "1",
    from: "lead@example.com",
    to: ["user@example.com"],
    subject: "Product Inquiry",
    body: "Hi, I'm interested in learning more about your product. Can you send me some information?",
    receivedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    starred: false,
    sentiment: "positive",
    intent: "interested",
    leadId: "lead123",
  },
  {
    id: "2",
    integrationId: "2",
    from: "customer@example.com",
    to: ["user@gmail.com"],
    subject: "Support Request",
    body: "I'm having issues with the product. Can you help me troubleshoot?",
    receivedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: false,
    starred: true,
    sentiment: "negative",
    intent: "needs_more_info",
    leadId: "lead456",
  },
];

// In a real app, these would be stored in the database
let integrations = [...mockIntegrations];
let emails = [...mockEmails];
let analysisSettings: EmailAnalysisSettings = {
  sentimentAnalysis: true,
  intentDetection: true,
  leadScoring: true,
  emailTemplates: true,
};

export const emailIntegrationService = {
  // Integration management
  getIntegrations: async (): Promise<EmailIntegration[]> => {
    // In a real app, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from("email_integrations")
    //   .select("*");
    // if (error) throw error;
    // return data;

    return integrations;
  },

  connectIntegration: async (provider: string): Promise<EmailIntegration> => {
    // In a real app, this would:
    // 1. Redirect to OAuth flow
    // 2. Get tokens
    // 3. Store in Supabase
    // 4. Return the integration

    // For now, we'll just simulate a successful connection
    const integration = integrations.find((i) => i.provider === provider);
    if (!integration) {
      throw new Error(`Integration not found for provider: ${provider}`);
    }

    const updatedIntegration = {
      ...integration,
      isConnected: true,
      lastSynced: new Date().toISOString(),
      accessToken: "mock_token",
      refreshToken: "mock_refresh_token",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    integrations = integrations.map((i) =>
      i.id === updatedIntegration.id ? updatedIntegration : i
    );

    return updatedIntegration;
  },

  disconnectIntegration: async (provider: string): Promise<void> => {
    // In a real app, this would:
    // 1. Revoke tokens
    // 2. Update Supabase

    const integration = integrations.find((i) => i.provider === provider);
    if (!integration) {
      throw new Error(`Integration not found for provider: ${provider}`);
    }

    const updatedIntegration = {
      ...integration,
      isConnected: false,
      lastSynced: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };

    integrations = integrations.map((i) =>
      i.id === updatedIntegration.id ? updatedIntegration : i
    );
  },

  syncEmails: async (provider: string): Promise<void> => {
    // In a real app, this would:
    // 1. Use the provider's API to fetch emails
    // 2. Store them in Supabase
    // 3. Update the lastSynced timestamp

    const integration = integrations.find((i) => i.provider === provider);
    if (!integration) {
      throw new Error(`Integration not found for provider: ${provider}`);
    }

    // Simulate syncing new emails
    const newEmails: EmailMessage[] = [
      {
        id: `new-${Date.now()}`,
        integrationId: integration.id,
        from: "newlead@example.com",
        to: [integration.email],
        subject: "New Inquiry",
        body: "This is a new email that was just synced.",
        receivedAt: new Date().toISOString(),
        read: false,
        starred: false,
        sentiment: "neutral",
        intent: "unknown",
      },
    ];

    emails = [...emails, ...newEmails];

    // Update lastSynced
    const updatedIntegration = {
      ...integration,
      lastSynced: new Date().toISOString(),
    };

    integrations = integrations.map((i) =>
      i.id === updatedIntegration.id ? updatedIntegration : i
    );
  },

  // Email management
  getEmails: async (options?: {
    integrationId?: string;
    leadId?: string;
    unreadOnly?: boolean;
    starredOnly?: boolean;
    limit?: number;
  }): Promise<EmailMessage[]> => {
    // In a real app, this would fetch from Supabase with filters
    // const { data, error } = await supabase
    //   .from("emails")
    //   .select("*")
    //   .eq(options?.integrationId ? "integrationId" : "true", options?.integrationId || true)
    //   .eq(options?.leadId ? "leadId" : "true", options?.leadId || true)
    //   .eq(options?.unreadOnly ? "read" : "true", options?.unreadOnly ? false : true)
    //   .eq(options?.starredOnly ? "starred" : "true", options?.starredOnly ? true : true)
    //   .order("receivedAt", { ascending: false })
    //   .limit(options?.limit || 50);
    // if (error) throw error;
    // return data;

    let filteredEmails = [...emails];

    if (options?.integrationId) {
      filteredEmails = filteredEmails.filter(
        (e) => e.integrationId === options.integrationId
      );
    }

    if (options?.leadId) {
      filteredEmails = filteredEmails.filter(
        (e) => e.leadId === options.leadId
      );
    }

    if (options?.unreadOnly) {
      filteredEmails = filteredEmails.filter((e) => !e.read);
    }

    if (options?.starredOnly) {
      filteredEmails = filteredEmails.filter((e) => e.starred);
    }

    // Sort by receivedAt (newest first)
    filteredEmails.sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );

    // Apply limit
    if (options?.limit) {
      filteredEmails = filteredEmails.slice(0, options.limit);
    }

    return filteredEmails;
  },

  getEmailById: async (id: string): Promise<EmailMessage | null> => {
    // In a real app, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from("emails")
    //   .select("*")
    //   .eq("id", id)
    //   .single();
    // if (error) throw error;
    // return data;

    const email = emails.find((e) => e.id === id);
    return email || null;
  },

  markEmailAsRead: async (id: string): Promise<void> => {
    // In a real app, this would update Supabase
    // const { error } = await supabase
    //   .from("emails")
    //   .update({ read: true })
    //   .eq("id", id);
    // if (error) throw error;

    emails = emails.map((e) => (e.id === id ? { ...e, read: true } : e));
  },

  toggleStarred: async (id: string): Promise<void> => {
    // In a real app, this would update Supabase
    // const email = await emailIntegrationService.getEmailById(id);
    // if (!email) throw new Error(`Email not found: ${id}`);
    //
    // const { error } = await supabase
    //   .from("emails")
    //   .update({ starred: !email.starred })
    //   .eq("id", id);
    // if (error) throw error;

    emails = emails.map((e) =>
      e.id === id ? { ...e, starred: !e.starred } : e
    );
  },

  // Analysis settings
  getAnalysisSettings: async (): Promise<EmailAnalysisSettings> => {
    // In a real app, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from("email_analysis_settings")
    //   .select("*")
    //   .single();
    // if (error) throw error;
    // return data;

    return analysisSettings;
  },

  updateAnalysisSettings: async (
    settings: Partial<EmailAnalysisSettings>
  ): Promise<EmailAnalysisSettings> => {
    // In a real app, this would update Supabase
    // const { data, error } = await supabase
    //   .from("email_analysis_settings")
    //   .update(settings)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;

    analysisSettings = {
      ...analysisSettings,
      ...settings,
    };

    return analysisSettings;
  },

  // Lead association
  associateEmailWithLead: async (
    emailId: string,
    leadId: string
  ): Promise<void> => {
    // In a real app, this would update Supabase
    // const { error } = await supabase
    //   .from("emails")
    //   .update({ leadId })
    //   .eq("id", emailId);
    // if (error) throw error;

    emails = emails.map((e) => (e.id === emailId ? { ...e, leadId } : e));
  },

  // Email analysis
  analyzeEmailSentiment: async (
    emailId: string
  ): Promise<"positive" | "negative" | "neutral"> => {
    // In a real app, this would use an AI service to analyze sentiment
    // For now, we'll just return a random sentiment
    const sentiments: ("positive" | "negative" | "neutral")[] = [
      "positive",
      "negative",
      "neutral",
    ];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    emails = emails.map((e) => (e.id === emailId ? { ...e, sentiment } : e));

    return sentiment;
  },

  detectEmailIntent: async (
    emailId: string
  ): Promise<
    "interested" | "not_interested" | "needs_more_info" | "unknown"
  > => {
    // In a real app, this would use an AI service to detect intent
    // For now, we'll just return a random intent
    const intents: (
      | "interested"
      | "not_interested"
      | "needs_more_info"
      | "unknown"
    )[] = ["interested", "not_interested", "needs_more_info", "unknown"];
    const intent = intents[Math.floor(Math.random() * intents.length)];

    emails = emails.map((e) => (e.id === emailId ? { ...e, intent } : e));

    return intent;
  },

  // Email templates
  getSuggestedTemplates: async (emailId: string): Promise<string[]> => {
    // In a real app, this would use an AI service to suggest templates
    // For now, we'll just return some mock templates
    return [
      "Thank you for your interest! Here's some information about our product...",
      "I'd be happy to help you troubleshoot. Let's start by...",
      "I understand your concerns. Let me address them one by one...",
    ];
  },

  // Lead scoring based on email interactions
  updateLeadScore: async (
    leadId: string,
    email: EmailMessage
  ): Promise<void> => {
    try {
      // Get the current lead
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (leadError) throw leadError;

      // Calculate new score based on email interaction
      let scoreChange = 0;

      // Base score for receiving an email
      scoreChange += 5;

      // Additional points based on email characteristics
      if (email.sentiment === "positive") scoreChange += 10;
      if (email.intent === "interested") scoreChange += 15;
      if (email.intent === "needs_more_info") scoreChange += 5;

      // Update lead score
      const newScore = Math.min(100, (lead.score || 0) + scoreChange);

      // Update lead in database
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          score: newScore,
          lastContact: new Date().toISOString(),
          interactions: (lead.interactions || 0) + 1,
        })
        .eq("id", leadId);

      if (updateError) throw updateError;

      // Log the interaction
      await supabase.from("lead_activity_log").insert({
        leadId,
        type: "Email",
        details: `Received email: ${email.subject}`,
        scoreChange,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating lead score:", error);
      throw error;
    }
  },

  // Email analysis with AI
  analyzeEmail: async (
    email: EmailMessage
  ): Promise<{
    sentiment: "positive" | "negative" | "neutral";
    intent: "interested" | "not_interested" | "needs_more_info" | "unknown";
    suggestedScore: number;
  }> => {
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll use a simple rule-based system
      const body = email.body.toLowerCase();

      // Sentiment analysis
      let sentiment: "positive" | "negative" | "neutral" = "neutral";
      if (
        body.includes("great") ||
        body.includes("excellent") ||
        body.includes("interested")
      ) {
        sentiment = "positive";
      } else if (body.includes("not interested") || body.includes("decline")) {
        sentiment = "negative";
      }

      // Intent detection
      let intent:
        | "interested"
        | "not_interested"
        | "needs_more_info"
        | "unknown" = "unknown";
      if (
        body.includes("interested") ||
        body.includes("would like to learn more")
      ) {
        intent = "interested";
      } else if (body.includes("not interested") || body.includes("decline")) {
        intent = "not_interested";
      } else if (
        body.includes("more information") ||
        body.includes("tell me more")
      ) {
        intent = "needs_more_info";
      }

      // Score suggestion
      let suggestedScore = 0;
      if (sentiment === "positive") suggestedScore += 10;
      if (intent === "interested") suggestedScore += 15;
      if (intent === "needs_more_info") suggestedScore += 5;

      return {
        sentiment,
        intent,
        suggestedScore,
      };
    } catch (error) {
      console.error("Error analyzing email:", error);
      throw error;
    }
  },
};
