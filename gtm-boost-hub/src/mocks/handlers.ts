import { http, HttpResponse, delay } from "msw";
import type { Lead } from "@/types/lead"; // Use primary Lead type
import { User, Organization, SubscriptionTier } from "@/types/auth";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";
import type {
  CustomField,
  DashboardLayout,
  LeadCategory,
  OrganizationConfig,
  IndustrySettings,
  PipelineStage,
} from "@/types/config";
import type {
  ActivityLogEntry,
  ScoringRule,
  ScorableLeadField,
  ScoringFieldConfig,
  ScoringConfig,
  DashboardStats,
  SubscriptionInfo,
  MockState,
} from "./types";
import {
  currentScoringConfig,
  currentMockLeads,
  currentMockPipelineStages,
  mockLeadActivity,
  dashboardStats,
  subscriptionInfo,
  updateMockLeads,
  updateMockPipelineStages,
  updateMockScoringConfig,
  calculateLeadScore,
} from "./mockData";

// --- API Handlers ---

// Super Admin Handler
const superAdminHandler = http.get("/api/admin/super", () => {
  return HttpResponse.json({
    user: {
      id: "1",
      email: "admin@gtmcentric.com",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    organization: {
      id: "1",
      name: "GTMCentric",
      subscriptionTier: "PREMIUM",
      subscriptionStatus: "ACTIVE",
      maxUsers: 50,
      currentUsers: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    stats: {
      totalOrganizations: 42,
      totalUsers: 156,
      monthlyRevenue: 2450,
      activeTrials: 8,
    },
    recentOrganizations: [
      {
        id: "1",
        name: "Acme Corp",
        plan: "Pro",
        users: "8/10",
        status: "Active",
        created: "2024-03-15",
      },
    ],
  });
});

// Auth Handlers
const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    await delay(150);

    if (email === "admin@example.com" && password === "admin123") {
      return HttpResponse.json({
        user: {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
        },
        token: "mock-jwt-token",
      });
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const { email, password, name } = (await request.json()) as {
      email: string;
      password: string;
      name: string;
    };
    await delay(150);

    return HttpResponse.json({
      user: {
        id: "2",
        email,
        name,
        role: "user",
      },
      token: "mock-jwt-token",
    });
  }),

  http.get("/api/auth/me", async () => {
    await delay(100);
    return HttpResponse.json({
      user: {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      },
    });
  }),
];

// Config Handlers
const configHandlers = [
  http.get("/api/organizations/:id/config", async () => {
    await delay(150);
    return HttpResponse.json<OrganizationConfig>({
      customFields: [
        {
          id: "1",
          name: "company_size",
          label: "Company Size",
          type: "select",
          required: false,
          options: ["1-10", "11-50", "51-200", "201-500", "500+"],
          description: "The size of the company",
          order: 1,
          isActive: true,
        },
        {
          id: "2",
          name: "annual_revenue",
          label: "Annual Revenue",
          type: "select",
          required: false,
          options: [
            "< $1M",
            "$1M - $10M",
            "$10M - $50M",
            "$50M - $100M",
            "> $100M",
          ],
          description: "The annual revenue of the company",
          order: 2,
          isActive: true,
        },
      ],
      dashboardLayouts: [
        {
          id: "1",
          name: "Default Layout",
          description: "Standard dashboard layout",
          widgets: [
            {
              id: "1",
              name: "Lead Stats",
              type: "leadStats",
              position: { x: 0, y: 0, w: 4, h: 2 },
              config: {},
              isActive: true,
            },
            {
              id: "2",
              name: "Pipeline Overview",
              type: "conversionFunnel",
              position: { x: 4, y: 0, w: 4, h: 2 },
              config: {},
              isActive: true,
            },
          ],
          isDefault: true,
        },
      ],
      pipelineStages: [
        {
          id: "new",
          name: "New",
          description: "New leads that need to be qualified",
          color: "#3B82F6",
          order: 0,
        },
        {
          id: "qualified",
          name: "Qualified",
          description: "Leads that have been qualified",
          color: "#10B981",
          order: 1,
        },
        {
          id: "proposal",
          name: "Proposal",
          description: "Leads with proposals sent",
          color: "#F59E0B",
          order: 2,
        },
        {
          id: "negotiation",
          name: "Negotiation",
          description: "Leads in negotiation phase",
          color: "#6366F1",
          order: 3,
        },
        {
          id: "closed-won",
          name: "Closed Won",
          description: "Successfully closed deals",
          color: "#22C55E",
          order: 4,
        },
        {
          id: "closed-lost",
          name: "Closed Lost",
          description: "Unsuccessful deals",
          color: "#EF4444",
          order: 5,
        },
      ],
      leadCategories: [
        {
          id: "mnc",
          name: "MNC",
          description: "Multinational corporations",
          color: "#3B82F6",
        },
        {
          id: "sme",
          name: "SME",
          description: "Small and medium enterprises",
          color: "#10B981",
        },
        {
          id: "startup",
          name: "Startup",
          description: "Early-stage companies",
          color: "#F59E0B",
        },
      ],
      industrySpecificSettings: {
        scoringRules: [
          {
            field: "company_size",
            operator: "in",
            value: ["201-500", "500+"],
            score: 10,
          },
          {
            field: "annual_revenue",
            operator: "in",
            value: ["$10M - $50M", "$50M - $100M", "> $100M"],
            score: 15,
          },
        ],
      },
    });
  }),

  http.post("/api/organizations/:id/config/fields", async ({ request }) => {
    const field = (await request.json()) as Omit<
      CustomField,
      "id" | "isActive"
    >;
    await delay(150);
    return HttpResponse.json<CustomField>({
      ...field,
      id: String(Date.now()),
      isActive: true,
    });
  }),

  http.put(
    "/api/organizations/:id/config/fields/:fieldId",
    async ({ request }) => {
      const field = (await request.json()) as CustomField;
      await delay(150);
      return HttpResponse.json<CustomField>(field);
    }
  ),

  http.delete("/api/organizations/:id/config/fields/:fieldId", async () => {
    await delay(150);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.put(
    "/api/organizations/:id/config/pipeline-stages",
    async ({ request }) => {
      const { stages } = (await request.json()) as { stages: PipelineStage[] };
      await delay(150);
      return HttpResponse.json<PipelineStage[]>(stages);
    }
  ),

  http.put(
    "/api/organizations/:id/config/lead-categories",
    async ({ request }) => {
      const { categories } = (await request.json()) as {
        categories: LeadCategory[];
      };
      await delay(150);
      return HttpResponse.json<LeadCategory[]>(categories);
    }
  ),

  http.put(
    "/api/organizations/:id/config/industry-settings",
    async ({ request }) => {
      const settings = (await request.json()) as IndustrySettings;
      await delay(150);
      return HttpResponse.json<IndustrySettings>(settings);
    }
  ),
];

// Export all handlers
export const handlers = [
  ...authHandlers,
  ...configHandlers,
  // Ignore favicon requests
  http.get("/favicon.ico", () => {
    return;
  }),

  // Handler for accidental GET /leads navigation attempts
  http.get("/leads", () => {
    console.warn(
      "[MSW] Intercepted unexpected GET /leads request. This might indicate a client-side routing issue."
    );
    return;
  }),

  // Leads API - GET
  http.get("/api/leads", async () => {
    try {
      await delay(150);
      return HttpResponse.json(currentMockLeads);
    } catch (error) {
      console.error("[MSW] General error in GET /api/leads handler:", error);
      return HttpResponse.json(
        {
          message: "Failed to fetch leads due to an internal error.",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }),

  // Leads API - POST (Add Lead)
  http.post("/api/leads", async ({ request }) => {
    // Ensure newLeadData conforms to Omit<Lead, "id" | "createdAt" | "updatedAt"> potentially
    const newLeadData = (await request.json()) as Partial<
      Omit<Lead, "id" | "createdAt" | "updatedAt">
    >;
    const newId = String(Date.now());
    // Construct new lead using the primary Lead structure
    const newLead: Lead = {
      id: newId,
      name: newLeadData.name || "Unknown Name",
      email: newLeadData.email || "",
      phone: newLeadData.phone || "",
      company: newLeadData.company || "",
      title: newLeadData.title || "",
      industry: newLeadData.industry || "",
      // Ensure status conforms to the Lead['status'] union type
      status: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Closed",
      ].includes(newLeadData.status as string)
        ? (newLeadData.status as Lead["status"])
        : "New",
      source: newLeadData.source || "",
      notes: newLeadData.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedinUrl: newLeadData.linkedinUrl,
      instagramUrl: newLeadData.instagramUrl,
      twitterUrl: newLeadData.twitterUrl,
      engagement: newLeadData.engagement,
      companySize: newLeadData.companySize,
      budget: newLeadData.budget,
      timeline: ["Immediate", "1-3 months", "3-6 months", "6+ months"].includes(
        newLeadData.timeline as string
      )
        ? (newLeadData.timeline as Lead["timeline"])
        : undefined,
      score: 0, // Initialize score
    };
    // Recalculate score based on the new structure and config
    // Ensure the object passed to calculateLeadScore matches its expected parameter type
    newLead.score = calculateLeadScore(newLead as Lead, currentScoringConfig); // Cast to Lead if necessary

    const updatedLeads = [...currentMockLeads, newLead];
    updateMockLeads(updatedLeads);
    await delay(300);
    return HttpResponse.json(newLead, { status: 201 });
  }),

  // Leads API - PUT (Update Lead)
  http.put("/api/leads/:id", async ({ request, params }) => {
    const { id } = params;
    const updatedData = (await request.json()) as Partial<Lead>;
    const leadToUpdate: Lead | undefined = currentMockLeads.find(
      (l) => l.id === id
    );

    if (leadToUpdate) {
      const updatedLeadData = { ...leadToUpdate, ...updatedData };
      updatedLeadData.score = calculateLeadScore(
        updatedLeadData,
        currentScoringConfig
      );

      const updatedLeads = currentMockLeads.map((lead) =>
        lead.id === id ? updatedLeadData : lead
      );
      updateMockLeads(updatedLeads);

      await delay(250);
      return HttpResponse.json(updatedLeadData);
    } else {
      await delay(100);
      return HttpResponse.json({ message: "Lead not found" }, { status: 404 });
    }
  }),

  // Leads API - DELETE (Delete Lead)
  http.delete("/api/leads/:id", async ({ params }) => {
    const { id } = params;
    const initialLength = currentMockLeads.length;
    const updatedLeads = currentMockLeads.filter((lead) => lead.id !== id);

    if (updatedLeads.length < initialLength) {
      updateMockLeads(updatedLeads);
      await delay(150);
      return HttpResponse.json(null, { status: 204 });
    } else {
      await delay(100);
      return HttpResponse.json({ message: "Lead not found" }, { status: 404 });
    }
  }),

  // Lead Activity API - GET
  http.get("/api/leads/:id/activity", async ({ params }) => {
    const { id } = params;
    await delay(200);
    const activities = mockLeadActivity.get(id as string) || [];
    return HttpResponse.json(activities);
  }),

  // Lead Activity API - POST
  http.post("/api/leads/:id/activity", async ({ request, params }) => {
    const { id } = params;
    const { type, details } = (await request.json()) as {
      type: ActivityLogEntry["type"];
      details: string;
    };

    if (!type || !details) {
      return HttpResponse.json(
        { message: "Missing type or details" },
        { status: 400 }
      );
    }

    const newActivity: ActivityLogEntry = {
      id: `act${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: type,
      details: details,
      userId: "currentUser",
    };

    const existingActivities = mockLeadActivity.get(id as string) || [];
    mockLeadActivity.set(id as string, [...existingActivities, newActivity]);

    await delay(250);
    return HttpResponse.json(newActivity, { status: 201 });
  }),

  // Dashboard Stats API
  http.get("/api/stats/dashboard", () => {
    return HttpResponse.json(dashboardStats);
  }),

  // Subscription Info API
  http.get("/api/subscription", async () => {
    await delay(50);
    return HttpResponse.json(subscriptionInfo);
  }),

  // Leads API - POST (Import Leads)
  http.post("/api/leads/import", async ({ request }) => {
    const leadsToImport = (await request.json()) as Omit<Lead, "id">[];
    let importedCount = 0;
    let skippedCount = 0;
    // Use direct email access and ensure currentMockLeads conforms to primary Lead type
    const existingEmails = new Set(
      currentMockLeads.map((lead) => lead.email.toLowerCase())
    );

    leadsToImport.forEach((leadData) => {
      // Assume leadData might still have contactInfo structure from import source
      // Also handle potential missing fields in leadData
      const email = leadData.email; // Use direct email
      if (!email) {
        console.warn(
          "[MSW] Skipped importing lead due to missing email:",
          leadData
        );
        skippedCount++;
        return; // Skip if no email
      }
      const emailLower = email.toLowerCase();

      if (existingEmails.has(emailLower)) {
        skippedCount++;
      } else {
        const newId = String(Date.now() + importedCount);
        // Construct new lead using the primary Lead structure
        const newLead: Lead = {
          id: newId,
          name: leadData.name || "Unknown Name",
          email: email,
          phone: leadData.phone || "",
          company: leadData.company || "",
          title: leadData.title || "",
          industry: leadData.industry || "",
          // Ensure status conforms to the Lead['status'] union type
          status: [
            "New",
            "Contacted",
            "Qualified",
            "Proposal",
            "Negotiation",
            "Closed",
          ].includes(leadData.status as string)
            ? (leadData.status as Lead["status"])
            : "New",
          source: leadData.source || "",
          notes: leadData.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          linkedinUrl: leadData.linkedinUrl,
          instagramUrl: leadData.instagramUrl,
          twitterUrl: leadData.twitterUrl,
          engagement: leadData.engagement,
          companySize: leadData.companySize,
          budget: leadData.budget,
          timeline: [
            "Immediate",
            "1-3 months",
            "3-6 months",
            "6+ months",
          ].includes(leadData.timeline as string)
            ? (leadData.timeline as Lead["timeline"])
            : undefined,
          score: 0, // Initialize score
        };
        // Recalculate score based on the new structure and config
        newLead.score = calculateLeadScore(newLead, currentScoringConfig);

        currentMockLeads.push(newLead);
        existingEmails.add(emailLower);
        importedCount++;
      }
    });

    updateMockLeads(currentMockLeads);
    await delay(500);

    return HttpResponse.json({ importedCount, skippedCount }, { status: 200 });
  }),

  // Pipeline Stages API
  http.get("/api/pipeline-stages", async () => {
    await delay(100);
    const sortedStages = [...currentMockPipelineStages].sort(
      (a, b) => a.order - b.order
    );
    return HttpResponse.json(sortedStages);
  }),

  http.post("/api/pipeline-stages", async ({ request }) => {
    const { name, color } = (await request.json()) as Partial<PipelineStage>;
    if (!name) {
      return HttpResponse.json(
        { message: "Stage name is required" },
        { status: 400 }
      );
    }
    const newId = name.toLowerCase().replace(/\s+/g, "-");
    if (currentMockPipelineStages.some((stage) => stage.id === newId)) {
      return HttpResponse.json(
        { message: `Stage with ID ${newId} already exists` },
        { status: 409 }
      );
    }
    const maxOrder = currentMockPipelineStages.reduce(
      (max, stage) => Math.max(max, stage.order),
      -1
    );
    const newStage: PipelineStage = {
      id: newId,
      name: name,
      description: "",
      order: maxOrder + 1,
      color: color,
    };
    const updatedStages = [...currentMockPipelineStages, newStage];
    updateMockPipelineStages(updatedStages);
    await delay(200);
    return HttpResponse.json(newStage, { status: 201 });
  }),

  http.put("/api/pipeline-stages/:id", async ({ request, params }) => {
    const { id } = params;
    const { name, color } = (await request.json()) as Partial<PipelineStage>;
    let updatedStage: PipelineStage | undefined = undefined;

    const updatedStages = currentMockPipelineStages.map((stage) => {
      if (stage.id === id) {
        updatedStage = {
          ...stage,
          name: name ?? stage.name,
          color: color ?? stage.color,
        };
        return updatedStage;
      }
      return stage;
    });

    if (updatedStage) {
      updateMockPipelineStages(updatedStages);
      await delay(150);
      return HttpResponse.json(updatedStage);
    } else {
      return HttpResponse.json(
        { message: "Pipeline stage not found" },
        { status: 404 }
      );
    }
  }),

  http.patch("/api/pipeline-stages", async ({ request }) => {
    const updates = (await request.json()) as { id: string; order: number }[];
    const stageMap = new Map(
      currentMockPipelineStages.map((stage) => [stage.id, stage])
    );
    let changesMade = false;

    updates.forEach((update) => {
      const stage = stageMap.get(update.id);
      if (stage && typeof update.order === "number") {
        stage.order = update.order;
        changesMade = true;
      }
    });

    if (changesMade) {
      const updatedStages = Array.from(stageMap.values());
      updateMockPipelineStages(updatedStages);
      await delay(200);
      const sortedStages = [...updatedStages].sort((a, b) => a.order - b.order);
      return HttpResponse.json(sortedStages);
    } else {
      return HttpResponse.json(
        { message: "No valid stage updates provided" },
        { status: 400 }
      );
    }
  }),

  http.delete("/api/pipeline-stages/:id", async ({ params }) => {
    const { id } = params;
    const initialLength = currentMockPipelineStages.length;
    const updatedStages = currentMockPipelineStages.filter(
      (stage) => stage.id !== id
    );

    const firstStageId = [...updatedStages].sort((a, b) => a.order - b.order)[0]
      ?.id;
    // Ensure the status being assigned is valid
    const validStatuses: Lead["status"][] = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal",
      "Negotiation",
      "Closed",
    ];
    if (
      firstStageId &&
      validStatuses.includes(firstStageId as Lead["status"])
    ) {
      const validFirstStageId = firstStageId as Lead["status"]; // Cast to the specific union type

      // Map and ensure correct type *before* rescoring
      const updatedLeadsTyped: Lead[] = currentMockLeads.map((lead): Lead => {
        if (lead.status === id) {
          // Return a new object explicitly typed as Lead with the corrected status
          return { ...lead, status: validFirstStageId };
        }
        // Return the original lead, assuming it already conforms to Lead type
        // If currentMockLeads could be inconsistent, more checks might be needed here
        return lead;
      });

      // Rescore using the correctly typed array
      const rescoredLeads = updatedLeadsTyped.map((typedLead) => ({
        ...typedLead,
        score: calculateLeadScore(typedLead, currentScoringConfig), // Pass the correctly typed lead
      }));

      updateMockLeads(rescoredLeads); // Pass the correctly typed array
    } else if (firstStageId) {
      console.warn(
        `[MSW] Could not reassign leads from deleted stage '${id}' to invalid stage '${firstStageId}'. Leads remain in old stage.`
      );
    }

    if (updatedStages.length < initialLength) {
      updateMockPipelineStages(updatedStages);
      await delay(150);
      return HttpResponse.json(null, { status: 204 });
    } else {
      return HttpResponse.json(
        { message: "Pipeline stage not found" },
        { status: 404 }
      );
    }
  }),

  // Scoring Config API
  http.get("/api/scoring-config", async () => {
    await delay(50);
    return HttpResponse.json(currentScoringConfig);
  }),

  http.put("/api/scoring-config", async ({ request }) => {
    const newConfig = (await request.json()) as ScoringConfig;
    updateMockScoringConfig(newConfig);

    // Ensure leads conform to Lead type before calculating score and updating
    const updatedLeads = currentMockLeads.map((lead): Lead => {
      // Validate and cast status explicitly
      const validStatuses: Lead["status"][] = [
        "New",
        "Contacted",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Closed",
      ];
      const validatedStatus = validStatuses.includes(
        lead.status as Lead["status"]
      )
        ? (lead.status as Lead["status"])
        : "New"; // Default to 'New' if invalid

      const typedLead = {
        ...lead,
        status: validatedStatus, // Use the validated status
      } as Lead; // Cast the whole object after ensuring status is correct

      return {
        ...typedLead,
        score: calculateLeadScore(typedLead, newConfig),
      };
    });
    updateMockLeads(updatedLeads); // Pass the correctly typed array

    await delay(150);
    return HttpResponse.json(newConfig);
  }),

  // Super Admin API
  superAdminHandler,

  // AI Insights API - GET (Returns leads for the page)
  http.get("/api/ai-insights", async () => {
    await delay(100);

    // Get mock leads with scoring data
    const leadsWithScores = currentMockLeads.map((lead) => {
      // Add mock scoring data if not present
      if (!lead.engagement) lead.engagement = Math.floor(Math.random() * 100);
      if (!lead.companySize)
        lead.companySize = Math.floor(Math.random() * 5000);
      if (!lead.budget) lead.budget = Math.floor(Math.random() * 200000);
      if (!lead.timeline) {
        const timelines = [
          "Immediate",
          "1-3 months",
          "3-6 months",
          "6+ months",
        ] as const;
        lead.timeline = timelines[Math.floor(Math.random() * timelines.length)];
      }

      return lead;
    });

    // Get mock job changes
    const jobChanges = [
      {
        id: "change-mock-1",
        leadId: "1",
        previousCompany: "Old Company A",
        previousTitle: "Junior Dev",
        newCompany: "SomLance",
        newTitle: "CEO",
        changeDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        source: "LinkedIn",
        status: "Pending",
      },
      {
        id: "change-mock-2",
        leadId: "3",
        previousCompany: "Startup X",
        previousTitle: "Marketing Intern",
        newCompany: "Prodomain",
        newTitle: "Head of Marketing",
        changeDate: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        source: "LinkedIn",
        status: "Pending",
      },
    ];

    return HttpResponse.json({
      leads: leadsWithScores,
      jobChanges: jobChanges,
    });
  }),
];
