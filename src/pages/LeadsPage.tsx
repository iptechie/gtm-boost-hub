import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Papa from "papaparse";
import { toast } from "sonner";
// Removed Header import
import LeadTable from "../components/LeadTable";
import type { Lead, LeadStatus } from "@/types/lead";
import LeadFilter from "../components/LeadFilter";
// Removed Sidebar import
import AddLeadDialog from "../components/AddLeadDialog";
import ImportLeadsDialog from "../components/ImportLeadsDialog";
// Removed NotificationPopover import
import { useLeadConfiguration } from "@/contexts/LeadConfigurationContext";
import {
  fetchLeads,
  fetchSubscriptionInfo,
  importLeads,
  ImportResult,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  isSameDay, // Keep for potential future use, but not for range
  isThisMonth,
  parse,
  parseISO,
  startOfMonth,
  startOfQuarter,
  subMonths,
  subYears,
  isWithinInterval,
  endOfMonth,
  endOfQuarter,
  endOfYear,
} from "date-fns";
import { mockLeadActivity } from "@/mocks/mockData";

// Define the filter structure including new fields
// Import DateRange type from react-day-picker
import type { DateRange } from "react-day-picker";

interface ActiveFilters {
  category?: string;
  stage?: Lead["status"];
  location?: string;
  lastCommunicationDateRange?: DateRange;
  industry?: string;
  source?: string;
  jobTitle?: string;
  lastContactRange?: string;
  scoreRange?: [number, number];
  communicationDetails?: string;
  activityDetails?: string;
}

// Define expected CSV headers
const EXPECTED_HEADERS = [
  "name",
  "title",
  "company",
  "email",
  "phone",
  "location",
  "status",
  "score",
  "lastContact",
  "nextFollowUp",
  "category",
  "industry",
];

// Define an interface representing a row from the CSV
interface CsvLeadRow {
  name: string;
  title?: string;
  company?: string;
  email: string;
  phone?: string;
  location?: string;
  status?: LeadStatus;
  score?: string;
  lastContact?: string;
  nextFollowUp?: string;
  category?: string;
  industry?: string;
  [key: string]: string | LeadStatus | undefined;
}

const LeadsPage: React.FC = () => {
  const { configuration, isLoading: isLoadingConfig } = useLeadConfiguration();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [importLeadsOpen, setImportLeadsOpen] = useState(false);
  // Removed notification state

  // Fetch leads
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    error: errorLeads,
  } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Fetch subscription info
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error: errorSubscription,
  } = useQuery({
    queryKey: ["subscriptionInfo"],
    queryFn: fetchSubscriptionInfo,
  });

  // Filter leads
  const filteredLeads = useMemo(() => {
    let leads = leadsData ?? [];
    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(lowerSearchTerm) ||
          lead.company.toLowerCase().includes(lowerSearchTerm) ||
          lead.email.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply activity details filter
    if (filters.activityDetails) {
      const lowerSearchTerm = filters.activityDetails.toLowerCase();
      leads = leads.filter((lead) => {
        // Get activities for this lead
        const activities = mockLeadActivity.get(lead.id) || [];
        // Search through activity details
        return activities.some((activity) =>
          activity.details.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }

    // Apply basic filters
    if (filters.category) {
      leads = leads.filter(
        (lead) =>
          lead.category?.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    if (filters.stage) {
      leads = leads.filter((lead) => lead.status === filters.stage);
    }
    if (filters.location) {
      const lowerLocation = filters.location.toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.location && lead.location.toLowerCase().includes(lowerLocation)
      );
    }
    // Apply Date Range Filter (using lastContact for example)
    if (filters.lastCommunicationDateRange?.from) {
      const fromDate = new Date(filters.lastCommunicationDateRange.from);
      // Ensure 'toDate' includes the full end day, even if only one day is selected
      const toDate = filters.lastCommunicationDateRange.to
        ? new Date(filters.lastCommunicationDateRange.to)
        : new Date(filters.lastCommunicationDateRange.from);

      // Set time components for accurate comparison across the entire day(s)
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999); // Set to end of the selected day

      leads = leads.filter((lead) => {
        let leadDate: Date | null = null;
        try {
          // Try parsing ISO format first, then fallback to 'MMM d, yyyy'
          try {
            leadDate = parseISO(lead.lastContact || "");
          } catch (isoError) {
            // If ISO parsing fails, try the specific format
            leadDate = parse(lead.lastContact || "", "MMM d, yyyy", new Date());
          }

          // Check if the parsed date is valid
          if (!leadDate || isNaN(leadDate.getTime())) {
            console.warn(
              `Invalid or unparseable date format for lead ${lead.id}: ${lead.lastContact}. Excluding from date filter.`
            );
            return false; // Exclude leads with invalid dates
          }

          // Perform inclusive comparison: Check if leadDate is on or after fromDate AND on or before toDate
          return leadDate >= fromDate && leadDate <= toDate;
        } catch (e) {
          // Log error if parsing fails for any reason
          console.error(
            `Error parsing or comparing date for lead ${lead.id}: ${lead.lastContact}`,
            e
          );
          return false;
        }
      });
    }

    // Apply 'More Filters'
    if (filters.industry) {
      leads = leads.filter(
        (lead) =>
          lead.industry?.toLowerCase() === filters.industry?.toLowerCase()
      );
    }
    // Add Source filter (maps to category)
    if (filters.source) {
      // Assuming source filter value is already lowercase from Select component
      leads = leads.filter(
        (lead) => lead.category?.toLowerCase() === filters.source
      );
    }
    // Add Job Title filter (maps to title)
    if (filters.jobTitle) {
      const lowerJobTitle = filters.jobTitle.toLowerCase();
      leads = leads.filter(
        (lead) => lead.title && lead.title.toLowerCase().includes(lowerJobTitle)
      );
    }
    if (filters.scoreRange) {
      const [minScore, maxScore] = filters.scoreRange;
      leads = leads.filter(
        (lead) => (lead.score || 0) >= minScore && (lead.score || 0) <= maxScore
      );
    }
    if (filters.lastContactRange) {
      const now = new Date();
      let interval: { start: Date; end: Date } | null = null;
      try {
        switch (filters.lastContactRange) {
          case "mtd":
            interval = { start: startOfMonth(now), end: now };
            break;
          case "last_quarter": {
            const currentQuarterStart = startOfQuarter(now);
            const prevQuarterStart = subMonths(currentQuarterStart, 3);
            interval = {
              start: prevQuarterStart,
              end: endOfQuarter(prevQuarterStart),
            };
            break;
          }
          case "last_3_months":
            interval = { start: subMonths(now, 3), end: now };
            break;
          case "last_6_months":
            interval = { start: subMonths(now, 6), end: now };
            break;
          case "last_year":
            interval = { start: subYears(now, 1), end: now };
            break;
        }
        if (interval) {
          const finalInterval = interval;
          leads = leads.filter((lead) => {
            try {
              let contactDate: Date | null = null;
              // Try parsing ISO format first, then fallback
              try {
                contactDate = parseISO(lead.lastContact || "");
              } catch (isoError) {
                contactDate = parse(
                  lead.lastContact || "",
                  "MMM d, yyyy",
                  new Date()
                );
              }

              if (!contactDate || isNaN(contactDate.getTime())) {
                console.warn(
                  `Invalid date format for lead ${lead.id} in range filter: ${lead.lastContact}. Excluding.`
                );
                return false;
              }
              return isWithinInterval(contactDate, finalInterval);
            } catch (e) {
              console.error(
                `Error parsing date range for lead ${lead.id}: ${lead.lastContact}`,
                e
              );
              return false;
            }
          });
        }
      } catch (e) {
        console.error("Error processing date range filter:", e);
      }
    }
    // Apply communication details filter
    if (filters.communicationDetails) {
      const lowerSearchTerm = filters.communicationDetails.toLowerCase();
      leads = leads.filter((lead) => {
        // Fetch activity data for this lead
        const activities = mockLeadActivity.get(lead.id) || [];
        return activities.some((activity) =>
          activity.details.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }
    return leads;
  }, [leadsData, searchTerm, filters]);

  // Calculate stats
  const calculatedStats = useMemo(() => {
    const initialStats = {
      total: { count: 0, growth: 0 },
      newThisMonth: { count: 0, growth: 0 },
      qualified: { count: 0, growth: 0 },
      opportunities: { count: 0, growth: 0 },
    };
    if (!leadsData) return initialStats;
    let newThisMonthCount = 0;
    let qualifiedCount = 0;
    let opportunitiesCount = 0;
    leadsData.forEach((lead) => {
      try {
        const contactDate = parse(
          lead.lastContact || "",
          "MMM d, yyyy",
          new Date()
        );
        if (isThisMonth(contactDate)) {
          // Refine logic if needed
        }
      } catch (e) {
        // Ignore parsing errors for stats calculation
      }
      if (lead.status === "New") newThisMonthCount++;
      if (lead.status === "Qualified") qualifiedCount++;
      if (lead.status === "Closed Won" || lead.status === "Closed Lost")
        opportunitiesCount++;
    });
    return {
      total: { count: leadsData.length, growth: 0 },
      newThisMonth: { count: newThisMonthCount, growth: 0 },
      qualified: { count: qualifiedCount, growth: 0 },
      opportunities: { count: opportunitiesCount, growth: 0 },
    };
  }, [leadsData]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilter = (newFilters: ActiveFilters) => {
    setFilters(newFilters);
  };

  // Event listeners
  useEffect(() => {
    const handleOpenAddLeadDialog = () => setAddLeadOpen(true);
    const handleOpenImportLeadsDialog = () => setImportLeadsOpen(true);
    // Removed notification event listener setup

    document.addEventListener("openAddLeadDialog", handleOpenAddLeadDialog);
    document.addEventListener(
      "openImportLeadsDialog",
      handleOpenImportLeadsDialog
    );
    // Removed notification event listener setup

    return () => {
      document.removeEventListener(
        "openAddLeadDialog",
        handleOpenAddLeadDialog
      );
      document.removeEventListener(
        "openImportLeadsDialog",
        handleOpenImportLeadsDialog
      );
      // Removed notification event listener cleanup
    };
  }, []); // Removed notification state dependencies if any were added previously

  // --- Lead Import Logic ---
  const importMutation = useMutation<
    ImportResult,
    Error,
    Omit<Lead, "id" | "createdAt" | "updatedAt">[]
  >({
    mutationFn: importLeads,
    onSuccess: (data: ImportResult) => {
      toast.success(
        `Successfully imported ${data.importedCount} leads. Skipped ${data.skippedCount} duplicates.`
      );
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionInfo"] });
    },
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`);
      console.error("Import error:", error);
    },
  });

  const handleUploadLeads = useCallback(
    async (file: File) => {
      if (importMutation.isPending) {
        toast.info("Import already in progress...");
        return;
      }
      toast.loading("Parsing CSV file...");
      return new Promise<void>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            toast.dismiss();
            const headers = results.meta.fields;
            if (
              !headers ||
              !EXPECTED_HEADERS.every((h) => headers.includes(h))
            ) {
              const missing = EXPECTED_HEADERS.filter(
                (h) => !headers?.includes(h)
              );
              toast.error(
                `Invalid CSV headers. Missing: ${missing.join(
                  ", "
                )}. Expected: ${EXPECTED_HEADERS.join(", ")}`
              );
              reject(new Error("Invalid CSV headers"));
              return;
            }

            const leadsToImport: Omit<
              Lead,
              "id" | "createdAt" | "updatedAt"
            >[] = [];
            const validationErrors: string[] = [];
            results.data.forEach((row: CsvLeadRow, index: number) => {
              const trimmedRow: Partial<CsvLeadRow> = {};
              for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                  const typedKey = key as keyof CsvLeadRow;
                  const value = row[typedKey];
                  trimmedRow[typedKey] =
                    typeof value === "string" ? value.trim() : value;
                }
              }

              if (!trimmedRow.name || !trimmedRow.email) {
                validationErrors.push(
                  `Row ${index + 2}: Missing required field (name or email).`
                );
              } else {
                const score = parseInt(trimmedRow.score ?? "0", 10);
                const status = (trimmedRow.status || "New") as LeadStatus;
                leadsToImport.push({
                  name: trimmedRow.name!,
                  title: trimmedRow.title || "",
                  company: trimmedRow.company || "",
                  email: trimmedRow.email!,
                  phone: trimmedRow.phone || "",
                  location: trimmedRow.location || undefined,
                  status,
                  score: isNaN(score) ? 0 : score,
                  lastContact: trimmedRow.lastContact || "",
                  nextFollowUp: trimmedRow.nextFollowUp || "",
                  category: trimmedRow.category || "",
                  industry: trimmedRow.industry || "",
                  notes: "",
                  source: "",
                });
              }
            });

            if (validationErrors.length > 0) {
              toast.error(
                `Validation errors found in CSV:\n${validationErrors
                  .slice(0, 5)
                  .join("\n")}${validationErrors.length > 5 ? "\n..." : ""}`
              );
              reject(new Error("CSV validation failed"));
              return;
            }
            if (leadsToImport.length === 0) {
              toast.warning("No valid leads found in the CSV file.");
              reject(new Error("No valid leads to import"));
              return;
            }

            toast.loading(`Importing ${leadsToImport.length} leads...`);
            importMutation
              .mutateAsync(leadsToImport)
              .then(() => {
                toast.dismiss();
                resolve();
              })
              .catch((err) => {
                toast.dismiss();
                reject(err);
              });
          },
          error: (error: Error) => {
            toast.dismiss();
            toast.error(`Error parsing CSV: ${error.message}`);
            console.error("CSV parsing error:", error);
            reject(error);
          },
        });
      });
    },
    [importMutation, queryClient]
  );
  // --- End Lead Import Logic ---

  const handleWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp");
  };

  // Return content directly, assuming MainLayout provides structure
  return (
    <>
      {/* Removed NotificationPopover */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-slate-700">
          Track and manage your leads efficiently
        </h2>
      </div>
      {/* Stats Cards */}
      {isLoadingLeads ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Skeleton className="h-32" /> <Skeleton className="h-32" />
          <Skeleton className="h-32" /> <Skeleton className="h-32" />
        </div>
      ) : errorLeads ? (
        <div className="text-red-500 mb-8">Error loading leads data.</div>
      ) : calculatedStats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards JSX remains the same */}
          <div className="glass-card p-6 hover-scale bg-blue-50/50">
            <h3 className="text-sm font-medium text-slate-500">Total Leads</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold">
                {calculatedStats.total.count}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  calculatedStats.total.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {calculatedStats.total.growth >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(calculatedStats.total.growth)}%
              </span>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Vs. previous period
            </div>
          </div>
          <div className="glass-card p-6 hover-scale bg-green-50/50">
            <h3 className="text-sm font-medium text-slate-500">New Leads</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold">
                {calculatedStats.newThisMonth.count}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  calculatedStats.newThisMonth.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {calculatedStats.newThisMonth.growth >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(calculatedStats.newThisMonth.growth)}%
              </span>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Vs. previous period
            </div>
          </div>
          <div className="glass-card p-6 hover-scale bg-purple-50/50">
            <h3 className="text-sm font-medium text-slate-500">
              Qualified Leads
            </h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold">
                {calculatedStats.qualified.count}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  calculatedStats.qualified.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {calculatedStats.qualified.growth >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(calculatedStats.qualified.growth)}%
              </span>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Vs. previous period
            </div>
          </div>
          <div className="glass-card p-6 hover-scale bg-amber-50/50">
            <h3 className="text-sm font-medium text-slate-500">Won Leads</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold">
                {calculatedStats.opportunities.count}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  calculatedStats.opportunities.growth >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {calculatedStats.opportunities.growth >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(calculatedStats.opportunities.growth)}%
              </span>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Vs. previous period
            </div>
          </div>
        </div>
      ) : null}
      {/* Subscription Info */}
      {isLoadingSubscription ? (
        <Skeleton className="h-40 mb-8" />
      ) : errorSubscription ? (
        <div className="text-red-500 mb-8">
          Error loading subscription info.
        </div>
      ) : subscriptionData ? (
        <div className="glass-card p-6 mb-8">
          {/* Subscription Info JSX remains the same */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gtm-gradient flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{subscriptionData.plan} Plan</h3>
                <p className="text-sm text-slate-500">
                  {subscriptionData.daysRemaining} days remaining
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-6">
                <h4 className="font-medium">Leads Usage</h4>
                <p className="text-sm text-slate-500">
                  {subscriptionData.usedLeads} / {subscriptionData.maxLeads}
                </p>
              </div>
              <button className="btn-gradient">
                Upgrade
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-6">
            <div className="progress-bar">
              <div
                className="progress-value"
                style={{
                  width: `${
                    (subscriptionData.usedLeads / subscriptionData.maxLeads) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>
                Used:{" "}
                {Math.round(
                  (subscriptionData.usedLeads / subscriptionData.maxLeads) * 100
                )}
                %
              </span>
              <span>
                Remaining:{" "}
                {subscriptionData.maxLeads - subscriptionData.usedLeads} leads
              </span>
            </div>
          </div>
        </div>
      ) : null}
      {/* Main Content */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Leads</h3>
        <LeadFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          configuration={configuration}
          isLoading={isLoadingConfig}
        />
        {isLoadingLeads ? (
          <Skeleton className="h-96" />
        ) : errorLeads ? (
          <div className="text-red-500">Error loading leads.</div>
        ) : (
          <LeadTable
            leads={filteredLeads}
            onEdit={(lead) => {
              console.log("Editing lead:", lead);
            }}
            onDelete={(id) => {
              console.log("Deleting lead:", id);
            }}
            onStatusChange={(id, status) => {
              console.log("Updating lead status:", id, status);
            }}
          />
        )}
      </div>
      {/* Removed closing divs for layout */}
      {/* Dialogs remain at the top level */}
      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} />
      <ImportLeadsDialog
        open={importLeadsOpen}
        onOpenChange={setImportLeadsOpen}
        onUpload={handleUploadLeads}
      />
    </>
  );
};

export default LeadsPage;
