import { http, HttpResponse, delay } from "msw";
import type { Lead } from "@/components/LeadTable"; // Assuming Lead type is exported

// --- Define Pipeline Stage Type ---
interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string; // Optional color
}

// --- Define Activity Log Type ---
interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO 8601 format string
  type: "Call" | "Email" | "Note" | "Meeting" | "StageChange";
  details: string;
  userId?: string; // Optional: ID of the user who performed the action
}

// --- Scoring Configuration ---

interface ScoringRule {
  id: string; // Unique ID for the rule
  condition: "equals" | "contains" | "isOneOf" | "isNotEmpty";
  value: string | string[]; // Value(s) to check against
  points: number; // Points awarded/deducted for this rule (within the field's context)
}

// Define which Lead fields are scorable. Use 'designation' for Job Title.
type ScorableLeadField =
  | "category"
  | "location"
  | "designation" // Maps to Job Title
  | "status" // Maps to Stage
  | "industry";

interface ScoringFieldConfig {
  fieldName: ScorableLeadField;
  label: string; // User-friendly label
  isActive: boolean;
  weight: number; // Percentage (0-100)
  rules: ScoringRule[];
}

interface ScoringConfig {
  fields: ScoringFieldConfig[];
}

const getInitialScoringConfig = (): ScoringConfig => {
  const storedConfig = sessionStorage.getItem("mockScoringConfig");
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      // Basic validation
      if (Array.isArray(parsed?.fields)) {
        // Further validation could be added here (e.g., check weights sum)
        return parsed;
      }
      console.warn("Stored scoring config is invalid, using default.");
    } catch (e) {
      console.error("Failed to parse stored scoring config, using default.", e);
    }
  }
  // Default Config - Weights should ideally sum to 100 for active fields
  const defaultConfig: ScoringConfig = {
    fields: [
      {
        fieldName: "category",
        label: "Category",
        isActive: true,
        weight: 20,
        rules: [
          { id: "cat1", condition: "equals", value: "MNC", points: 10 },
          { id: "cat2", condition: "equals", value: "Regional", points: 7 },
          { id: "cat3", condition: "equals", value: "Local", points: 3 },
        ],
      },
      {
        fieldName: "location",
        label: "Location",
        isActive: true,
        weight: 15,
        rules: [
          { id: "loc1", condition: "contains", value: "New York", points: 10 },
          { id: "loc2", condition: "contains", value: "London", points: 10 },
          { id: "loc3", condition: "contains", value: "India", points: 5 },
        ],
      },
      {
        fieldName: "designation", // Job Title
        label: "Job Title",
        isActive: true,
        weight: 30,
        rules: [
          { id: "des1", condition: "equals", value: "CEO", points: 15 },
          { id: "des2", condition: "equals", value: "CTO", points: 12 },
          { id: "des3", condition: "contains", value: "VP", points: 10 },
          { id: "des4", condition: "contains", value: "Director", points: 8 },
          { id: "des5", condition: "contains", value: "Manager", points: 5 },
        ],
      },
      {
        fieldName: "status", // Stage
        label: "Stage",
        isActive: true,
        weight: 15,
        rules: [
          { id: "sta1", condition: "equals", value: "Qualified", points: 10 },
          { id: "sta2", condition: "equals", value: "Contacted", points: 5 },
          { id: "sta3", condition: "equals", value: "New", points: 2 },
          // Won/Lost might not contribute positively to *lead* score
        ],
      },
      {
        fieldName: "industry",
        label: "Industry",
        isActive: true,
        weight: 20, // 20+15+30+15+20 = 100
        rules: [
          { id: "ind1", condition: "equals", value: "Technology", points: 10 },
          { id: "ind2", condition: "equals", value: "Finance", points: 8 },
          { id: "ind3", condition: "equals", value: "Education", points: 5 },
        ],
      },
    ],
  };
  sessionStorage.setItem("mockScoringConfig", JSON.stringify(defaultConfig));
  return defaultConfig;
};

let currentScoringConfig: ScoringConfig = getInitialScoringConfig();

const updateStoredScoringConfig = (config: ScoringConfig) => {
  sessionStorage.setItem("mockScoringConfig", JSON.stringify(config));
};

// --- Score Calculation Logic ---

const calculateLeadScore = (
  lead: Omit<Lead, "id" | "score"> | Lead, // Accept full Lead type too
  config: ScoringConfig
): number => {
  let totalWeightedScore = 0;
  let totalActiveWeight = 0;

  config.fields.forEach((fieldConfig) => {
    if (!fieldConfig.isActive || fieldConfig.weight <= 0) {
      return; // Skip inactive or zero-weight fields
    }

    totalActiveWeight += fieldConfig.weight;
    let fieldScore = 0;
    const leadIdentifier = lead
      ? lead.name || ("id" in lead ? `(ID: ${lead.id})` : "(ID missing)")
      : "(unknown lead)";

    // Check if the field exists on the lead object before accessing
    if (!Object.prototype.hasOwnProperty.call(lead, fieldConfig.fieldName)) {
      // console.log(`[ScoreCalc] Lead: ${leadIdentifier}, Field: ${fieldConfig.fieldName} does not exist. Skipping.`);
      return; // Skip scoring for this field if it doesn't exist on the lead
    }

    // Handle potential undefined fields gracefully
    const leadValueRaw = lead[fieldConfig.fieldName as keyof typeof lead];
    // console.log(`[ScoreCalc] Lead: ${leadIdentifier}, Field: ${fieldConfig.fieldName}, RawValue:`, leadValueRaw);

    // Ensure leadValue is a string before proceeding with string operations
    if (typeof leadValueRaw === "string" && leadValueRaw.trim() !== "") {
      const leadValueLower = leadValueRaw.toLowerCase();
      // console.log(`[ScoreCalc] Lead: ${leadIdentifier}, Field: ${fieldConfig.fieldName}, LowerValue: ${leadValueLower}`);

      fieldConfig.rules.forEach((rule) => {
        // console.log(`[ScoreCalc] Lead: ${leadIdentifier}, Field: ${fieldConfig.fieldName}, Evaluating Rule: ${rule.id}`);
        let match = false;
        const ruleValue = rule.value;

        try {
          // Wrap individual rule evaluation
          switch (rule.condition) {
            case "equals":
              if (typeof ruleValue === "string") {
                match = leadValueLower === ruleValue.toLowerCase();
              }
              break;
            case "contains":
              if (typeof ruleValue === "string") {
                match = leadValueLower.includes(ruleValue.toLowerCase());
              }
              break;
            case "isOneOf":
              if (Array.isArray(ruleValue)) {
                match = ruleValue.some(
                  (val) =>
                    typeof val === "string" &&
                    leadValueLower === val.toLowerCase()
                );
              }
              break;
            case "isNotEmpty":
              // Check the original raw value for emptiness, not the lowercased one
              match = leadValueRaw !== undefined && leadValueRaw !== "";
              break;
          }
        } catch (e) {
          // Catch errors during rule evaluation
          console.error(
            `[ScoreCalc] Error evaluating rule ${rule.id} (Condition: ${rule.condition}) for field ${fieldConfig.fieldName} on lead ${leadIdentifier}:`,
            e
          );
          // Continue to the next rule if one fails
        }

        if (match) {
          // console.log(`[ScoreCalc] Lead: ${leadIdentifier}, Field: ${fieldConfig.fieldName}, Rule ${rule.id} MATCHED. Points: ${rule.points}`);
          fieldScore += rule.points;
          // Assuming additive points for multiple matching rules within a field
        }
      });
    }
    // Add weighted score for this field
    // Normalize the field score based on max possible points for that field?
    // For now, just use the raw points sum for the field.
    totalWeightedScore += fieldScore * (fieldConfig.weight / 100);
  });

  // Normalize the final score to be between 0 and 100
  // This normalization needs refinement. Let's try scaling based on max possible points.
  // Estimate max points per field based on defaults (e.g., Category max 10, Location max 10, Job Title max 15, Stage max 10, Industry max 10)
  const maxPossibleWeightedScore = config.fields.reduce((sum, field) => {
    if (!field.isActive) return sum;
    const maxPointsForRule = Math.max(0, ...field.rules.map((r) => r.points)); // Simple max points for a single rule
    return sum + maxPointsForRule * (field.weight / 100);
  }, 0);

  // Avoid division by zero
  let finalScore = 0;
  if (maxPossibleWeightedScore > 0) {
    // Scale score relative to the max possible weighted score
    finalScore = (totalWeightedScore / maxPossibleWeightedScore) * 100;
  } else {
    // If max score is 0 (e.g., no active fields/rules with points), score is 0
    finalScore = 0;
    // Alternatively, could return totalWeightedScore if that makes sense, but 0 is safer for normalization
  }

  // Ensure score is a finite number and clamp between 0 and 100
  if (!isFinite(finalScore)) {
    console.warn(
      `Score calculation resulted in non-finite number for lead ${
        lead.name || ("id" in lead ? lead.id : "")
      }. Resetting to 0.`
    );
    finalScore = 0; // Reset non-finite scores (Infinity, NaN) to 0
  }
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

  // console.log(`Calculated score for ${lead.name}: ${finalScore} (Raw Weighted: ${totalWeightedScore.toFixed(2)}, Max Possible Weighted: ${maxPossibleWeightedScore.toFixed(2)})`);
  return finalScore;
};

// --- Mock Data ---

// Function to get initial leads, trying sessionStorage first
const getInitialLeads = (): Lead[] => {
  const storedLeads = sessionStorage.getItem("mockLeads");
  if (storedLeads) {
    try {
      return JSON.parse(storedLeads);
    } catch (e) {
      console.error("Failed to parse stored leads, using default.", e);
      // Fallback to default if parsing fails
    }
  }
  // Default leads if nothing in sessionStorage or parsing failed
  const defaultLeads: Lead[] = [
    {
      id: "1",
      name: "Somnath Ghosh",
      designation: "CEO",
      company: "SomLance",
      contactInfo: {
        email: "ghoshsomnath5@gmail.com",
        phone: "+91 91-9836841074",
      },
      location: "Kolkata, India",
      value: 15000,
      status: "Qualified",
      category: "Regional",
      industry: "Technology",
      lastContact: "Mar 23, 2025",
      nextFollowUp: "Mar 29, 2025",
      score: 92, // Initial score, will be recalculated if config exists
    },
    {
      id: "2",
      name: "Sanchita Ghosh",
      designation: "CTO",
      company: "SomLance",
      contactInfo: {
        email: "ghoshsomnath5@gmail.com",
        phone: "+91 91-9836841074",
      },
      location: "Mumbai, India",
      value: 8500,
      status: "New",
      category: "Local",
      industry: "Education",
      lastContact: "Mar 23, 2025",
      nextFollowUp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      score: 50, // Initial score
    },
    {
      id: "3",
      name: "Sanchita Ghosh",
      designation: "Head of Marketing",
      company: "Prodomain",
      contactInfo: {
        email: "sanchita@gmail.com",
        phone: "+91 91-9836841074",
      },
      location: "London, UK",
      value: 22000,
      status: "Won",
      category: "MNC",
      industry: "Finance",
      lastContact: "Mar 23, 2025",
      nextFollowUp: "Mar 27, 2025",
      score: 66, // Initial score
    },
  ];
  // Recalculate scores based on default config before storing initially
  const config = getInitialScoringConfig(); // Get default config
  const scoredLeads = defaultLeads.map((lead) => ({
    ...lead,
    score: calculateLeadScore(lead, config),
  }));
  sessionStorage.setItem("mockLeads", JSON.stringify(scoredLeads)); // Store default leads with calculated scores
  return scoredLeads;
};

// Use a mutable variable, initialized with potentially stored leads
let currentMockLeads: Lead[] = getInitialLeads();

// Function to update sessionStorage for leads
const updateStoredLeads = (leads: Lead[]) => {
  sessionStorage.setItem("mockLeads", JSON.stringify(leads));
};

// --- Mock Pipeline Stages Data ---

const getInitialPipelineStages = (): PipelineStage[] => {
  const storedStages = sessionStorage.getItem("mockPipelineStages");
  if (storedStages) {
    try {
      return JSON.parse(storedStages);
    } catch (e) {
      console.error("Failed to parse stored stages, using default.", e);
    }
  }
  // Default stages
  const defaultStages: PipelineStage[] = [
    { id: "New", name: "New", order: 0, color: "bg-blue-100" },
    { id: "Contacted", name: "Contacted", order: 1, color: "bg-purple-100" },
    { id: "Qualified", name: "Qualified", order: 2, color: "bg-amber-100" },
    { id: "Won", name: "Won", order: 3, color: "bg-green-100" },
    { id: "Lost", name: "Lost", order: 4, color: "bg-red-100" }, // Added Lost stage
  ];
  sessionStorage.setItem("mockPipelineStages", JSON.stringify(defaultStages));
  return defaultStages;
};

let currentMockPipelineStages: PipelineStage[] = getInitialPipelineStages();

// Function to update sessionStorage for stages
const updateStoredPipelineStages = (stages: PipelineStage[]) => {
  sessionStorage.setItem("mockPipelineStages", JSON.stringify(stages));
};

// --- Mock Lead Activity Data ---
const mockLeadActivity = new Map<string, ActivityLogEntry[]>([
  [
    "1", // Lead ID 1 (Somnath Ghosh)
    [
      {
        id: "act101",
        timestamp: "2025-03-28T10:30:00Z",
        type: "Call",
        details: "Initial contact call, discussed needs.",
        userId: "user1",
      },
      {
        id: "act102",
        timestamp: "2025-03-29T14:00:00Z",
        type: "Email",
        details: "Sent follow-up email with brochure.",
        userId: "user1",
      },
      {
        id: "act103",
        timestamp: "2025-03-30T09:15:00Z",
        type: "StageChange",
        details: "Stage changed from New to Contacted.",
        userId: "system",
      },
    ],
  ],
  [
    "3", // Lead ID 3 (Sanchita Ghosh - Prodomain)
    [
      {
        id: "act301",
        timestamp: "2025-03-25T11:00:00Z",
        type: "Meeting",
        details: "Discovery meeting held.",
        userId: "user2",
      },
      {
        id: "act302",
        timestamp: "2025-03-26T16:45:00Z",
        type: "Note",
        details: "Lead interested in premium features.",
        userId: "user2",
      },
    ],
  ],
]);

// --- Mock Data Stats (Potentially outdated, remove if not used) ---
// const leadStats = { ... }; // Commented out as it's static

// Derived from Dashboard.tsx StatsCard props (Keep for now)
const dashboardStats = {
  totalLeads: { value: 86, change: { value: "12%", positive: true } },
  conversionRate: { value: "24%", change: { value: "3%", positive: true } },
  meetingsBooked: { value: 12, change: { value: "5%", positive: false } },
  dealsClosed: { value: 8, change: { value: "18%", positive: true } },
};

// Derived from Dashboard.tsx SubscriptionInfo props
const subscriptionInfo = {
  plan: "Pro",
  daysRemaining: 14,
  usedLeads: 35,
  maxLeads: 50,
};

// --- API Handlers ---

export const handlers = [
  // Ignore favicon requests
  http.get("/favicon.ico", () => {
    return;
  }),

  // Handler for accidental GET /leads navigation attempts
  // This likely indicates a client-side routing issue where a button/link
  // is incorrectly navigating instead of performing an action.
  http.get("/leads", () => {
    console.warn(
      "[MSW] Intercepted unexpected GET /leads request. This might indicate a client-side routing issue."
    );
    // Return nothing to let the client-side router potentially handle it,
    // or return an empty response if needed.
    return;
  }),

  // Leads API - GET
  http.get("/api/leads", async () => {
    try {
      await delay(150); // Simulate network latency

      // Return the mock leads data that matches the Lead type
      return HttpResponse.json(currentMockLeads);

      /* --- Original Logic (Commented Out) ---
      // Ensure scores are up-to-date based on current config before returning
      // const scoredLeads = currentMockLeads.map((lead) => ({
      //   ...lead,
      //   score: calculateLeadScore(lead, currentScoringConfig),
      // }));
      // // Update mock data and storage only if scores actually changed
      // if (JSON.stringify(scoredLeads) !== JSON.stringify(currentMockLeads)) {
      //   currentMockLeads = scoredLeads;
      //   updateStoredLeads(currentMockLeads);
      // }
      // // Return the potentially updated list
      // try {
      //   // console.log("[MSW] Returning leads:", currentMockLeads); // Add log before returning
      //   return HttpResponse.json(currentMockLeads);
      // } catch (serializationError) {
        console.error(
          "[MSW] Error serializing leads data:",
          serializationError
        );
        return HttpResponse.json(
          {
            message: "Failed to serialize leads data.",
            error:
              serializationError instanceof Error
                ? serializationError.message
                : String(serializationError),
          },
          { status: 500 }
        );
      }
      */
    } catch (error) {
      console.error("[MSW] General error in GET /api/leads handler:", error); // More specific log
      // Return a 500 error with a message
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
    const newLeadData = (await request.json()) as Omit<Lead, "id">;
    const newId = String(Date.now()); // Simple ID generation for mock
    const newLead: Lead = {
      ...newLeadData,
      id: newId,
      location: newLeadData.location || undefined,
      value: newLeadData.value || 0,
      status: newLeadData.status || "New",
      lastContact:
        newLeadData.lastContact ||
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      nextFollowUp: newLeadData.nextFollowUp || "",
      score: 0, // Initialize score, will be calculated next
    };
    // Calculate score
    newLead.score = calculateLeadScore(newLead, currentScoringConfig);

    currentMockLeads.push(newLead);
    updateStoredLeads(currentMockLeads); // Update sessionStorage
    await delay(300); // Simulate network latency
    return HttpResponse.json(newLead, { status: 201 }); // Return created lead
  }),

  // Leads API - PUT (Update Lead)
  http.put("/api/leads/:id", async ({ request, params }) => {
    const { id } = params;
    const updatedData = (await request.json()) as Partial<Lead>;
    const leadToUpdate: Lead | undefined = currentMockLeads.find(
      (l) => l.id === id
    );

    if (leadToUpdate) {
      // Apply updates
      const updatedLeadData = { ...leadToUpdate, ...updatedData };
      // Recalculate score
      updatedLeadData.score = calculateLeadScore(
        updatedLeadData,
        currentScoringConfig
      );

      // Update the array
      currentMockLeads = currentMockLeads.map((lead) =>
        lead.id === id ? updatedLeadData : lead
      );

      updateStoredLeads(currentMockLeads); // Update sessionStorage
      await delay(250); // Simulate latency
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
    currentMockLeads = currentMockLeads.filter((lead) => lead.id !== id);

    if (currentMockLeads.length < initialLength) {
      updateStoredLeads(currentMockLeads); // Update sessionStorage
      await delay(150);
      return HttpResponse.json(null, { status: 204 }); // No Content = Success
    } else {
      await delay(100);
      return HttpResponse.json({ message: "Lead not found" }, { status: 404 });
    }
  }),

  // Lead Activity API - GET
  http.get("/api/leads/:id/activity", async ({ params }) => {
    const { id } = params;
    await delay(200); // Simulate network latency
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
      id: `act${Date.now()}`, // Simple unique ID
      timestamp: new Date().toISOString(),
      type: type,
      details: details,
      userId: "currentUser", // Placeholder for logged-in user
    };

    const existingActivities = mockLeadActivity.get(id as string) || [];
    mockLeadActivity.set(id as string, [...existingActivities, newActivity]);

    await delay(250); // Simulate network latency
    return HttpResponse.json(newActivity, { status: 201 }); // Return created activity
  }),

  // Lead Stats API - GET (Commented out as static data is likely inaccurate now)
  // http.get("/api/stats/leads", () => {
  //   return HttpResponse.json(leadStats);
  // }),

  // Dashboard Stats API
  http.get("/api/stats/dashboard", () => {
    return HttpResponse.json(dashboardStats);
  }),

  // Subscription Info API
  http.get("/api/subscription", async () => {
    await delay(50); // Add small delay
    // Return data that matches the SubscriptionInfo type
    return HttpResponse.json({
      plan: "Pro",
      daysRemaining: 14,
      usedLeads: 35,
      maxLeads: 50,
    });
  }),

  // Leads API - POST (Import Leads)
  http.post("/api/leads/import", async ({ request }) => {
    const leadsToImport = (await request.json()) as Omit<Lead, "id">[];
    let importedCount = 0;
    let skippedCount = 0;
    const existingEmails = new Set(
      currentMockLeads.map((lead) => lead.contactInfo.email.toLowerCase())
    );

    leadsToImport.forEach((leadData) => {
      const emailLower = leadData.contactInfo.email.toLowerCase();
      if (existingEmails.has(emailLower)) {
        skippedCount++;
      } else {
        const newId = String(Date.now() + importedCount); // Simple unique ID
        const newLead: Lead = {
          ...leadData,
          id: newId,
          location: leadData.location || undefined,
          value: leadData.value || 0,
          status: leadData.status || "New",
          lastContact:
            leadData.lastContact ||
            new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          nextFollowUp: leadData.nextFollowUp || "",
          score: 0, // Initialize score, calculate below
        };
        // Calculate score
        newLead.score = calculateLeadScore(newLead, currentScoringConfig);

        currentMockLeads.push(newLead);
        existingEmails.add(emailLower); // Add new email to set
        importedCount++;
      }
    });

    updateStoredLeads(currentMockLeads); // Update sessionStorage
    await delay(500); // Simulate import processing time

    return HttpResponse.json({ importedCount, skippedCount }, { status: 200 });
  }),

  // --- Pipeline Stages API Handlers ---

  // GET /api/pipeline-stages
  http.get("/api/pipeline-stages", async () => {
    await delay(100);
    // Return stages sorted by order
    const sortedStages = [...currentMockPipelineStages].sort(
      (a, b) => a.order - b.order
    );
    return HttpResponse.json(sortedStages);
  }),

  // POST /api/pipeline-stages (Create Stage)
  http.post("/api/pipeline-stages", async ({ request }) => {
    const { name, color } = (await request.json()) as Partial<PipelineStage>;
    if (!name) {
      return HttpResponse.json(
        { message: "Stage name is required" },
        { status: 400 }
      );
    }
    const newId = name.toLowerCase().replace(/\s+/g, "-"); // Simple ID from name
    if (currentMockPipelineStages.some((stage) => stage.id === newId)) {
      return HttpResponse.json(
        { message: `Stage with ID ${newId} already exists` },
        { status: 409 } // Conflict
      );
    }
    const maxOrder = currentMockPipelineStages.reduce(
      (max, stage) => Math.max(max, stage.order),
      -1
    );
    const newStage: PipelineStage = {
      id: newId,
      name: name,
      order: maxOrder + 1,
      color: color,
    };
    currentMockPipelineStages.push(newStage);
    updateStoredPipelineStages(currentMockPipelineStages);
    await delay(200);
    return HttpResponse.json(newStage, { status: 201 });
  }),

  // PUT /api/pipeline-stages/:id (Update Stage Name/Color)
  http.put("/api/pipeline-stages/:id", async ({ request, params }) => {
    const { id } = params;
    const { name, color } = (await request.json()) as Partial<PipelineStage>;
    let updatedStage: PipelineStage | undefined = undefined;

    currentMockPipelineStages = currentMockPipelineStages.map((stage) => {
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
      updateStoredPipelineStages(currentMockPipelineStages);
      await delay(150);
      return HttpResponse.json(updatedStage);
    } else {
      return HttpResponse.json(
        { message: "Pipeline stage not found" },
        { status: 404 }
      );
    }
  }),

  // PATCH /api/pipeline-stages (Batch Update Order)
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
      currentMockPipelineStages = Array.from(stageMap.values());
      updateStoredPipelineStages(currentMockPipelineStages);
      await delay(200);
      const sortedStages = [...currentMockPipelineStages].sort(
        (a, b) => a.order - b.order
      );
      return HttpResponse.json(sortedStages);
    } else {
      return HttpResponse.json(
        { message: "No valid stage updates provided" },
        { status: 400 }
      );
    }
  }),

  // DELETE /api/pipeline-stages/:id
  http.delete("/api/pipeline-stages/:id", async ({ params }) => {
    const { id } = params;
    const initialLength = currentMockPipelineStages.length;
    currentMockPipelineStages = currentMockPipelineStages.filter(
      (stage) => stage.id !== id
    );

    const firstStageId = [...currentMockPipelineStages].sort(
      (a, b) => a.order - b.order
    )[0]?.id;
    if (firstStageId) {
      currentMockLeads = currentMockLeads.map((lead) =>
        lead.status === id ? { ...lead, status: firstStageId } : lead
      );
      // Recalculate scores for affected leads
      currentMockLeads = currentMockLeads.map((lead) => ({
        ...lead,
        score: calculateLeadScore(lead, currentScoringConfig),
      }));
      updateStoredLeads(currentMockLeads); // Update leads as well
    }

    if (currentMockPipelineStages.length < initialLength) {
      updateStoredPipelineStages(currentMockPipelineStages);
      await delay(150);
      return HttpResponse.json(null, { status: 204 }); // No Content
    } else {
      return HttpResponse.json(
        { message: "Pipeline stage not found" },
        { status: 404 }
      );
    }
  }),

  // --- Scoring Config API Handlers (Placeholder) ---

  // GET /api/scoring-config
  http.get("/api/scoring-config", async () => {
    await delay(50);
    return HttpResponse.json(currentScoringConfig);
  }),

  // PUT /api/scoring-config (Replace entire config)
  http.put("/api/scoring-config", async ({ request }) => {
    const newConfig = (await request.json()) as ScoringConfig;
    // Add validation here if needed (e.g., check weights sum to 100)
    currentScoringConfig = newConfig;
    updateStoredScoringConfig(currentScoringConfig);

    // Trigger recalculation of all lead scores after config change
    currentMockLeads = currentMockLeads.map((lead) => ({
      ...lead,
      score: calculateLeadScore(lead, currentScoringConfig),
    }));
    updateStoredLeads(currentMockLeads);

    await delay(150);
    return HttpResponse.json(currentScoringConfig);
  }),
];
