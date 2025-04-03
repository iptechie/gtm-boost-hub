import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  fetchLeads,
  fetchPipelineStages,
  updateLead,
  PipelineStage, // Import the type
} from "@/lib/api"; // Import API functions and type
import type { Lead } from "@/components/LeadTable"; // Import Lead type
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Import Button
import { Plus, Settings, Trash2, Edit, MapPin } from "lucide-react"; // Import icons (Added MapPin)
import { cn } from "@/lib/utils";
import AddStageDialog from "@/components/AddStageDialog";
import EditStageDialog from "@/components/EditStageDialog";
import DeleteStageConfirmation from "@/components/DeleteStageConfirmation";
import LeadFilter from "@/components/LeadFilter"; // Import LeadFilter
import type { ActiveFilters } from "@/components/LeadFilter"; // Import filter type
import { debounce } from "lodash-es"; // For debouncing search
import { parse } from "date-fns"; // Import parse for date filtering

// --- Helper Functions ---
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return "$0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Helper function for score color (similar to LeadTable)
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
};

// Define a type for leads grouped by stage
type LeadsByStage = Record<string, Lead[]>;

const PipelinePage: React.FC = () => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingStages, setIsLoadingStages] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  const [isEditStageModalOpen, setIsEditStageModalOpen] = useState(false);
  const [isDeleteStageModalOpen, setIsDeleteStageModalOpen] = useState(false);
  const [currentStageToEdit, setCurrentStageToEdit] = useState<
    PipelineStage | undefined
  >(undefined);
  const [currentStageToDelete, setCurrentStageToDelete] = useState<
    PipelineStage | undefined
  >(undefined);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch stages and leads on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingStages(true);
        setIsLoadingLeads(true);
        setError(null);

        const [fetchedStages, fetchedLeads] = await Promise.all([
          fetchPipelineStages(),
          fetchLeads(),
        ]);

        setStages(fetchedStages);
        setLeads(fetchedLeads);
      } catch (err) {
        console.error("Failed to load pipeline data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load pipeline data"
        );
        toast.error("Failed to load pipeline data");
      } finally {
        setIsLoadingStages(false);
        setIsLoadingLeads(false);
      }
    };
    loadData();
  }, []);

  // Group leads by stage using useMemo for optimization
  const leadsByStage = useMemo(() => {
    // Apply filters and search term first
    const filteredLeads = leads.filter((lead) => {
      // Search term filter (case-insensitive)
      const lowerSearchTerm = searchTerm.toLowerCase();
      if (
        searchTerm &&
        !(
          lead.name.toLowerCase().includes(lowerSearchTerm) ||
          lead.company.toLowerCase().includes(lowerSearchTerm) ||
          lead.contactInfo.email.toLowerCase().includes(lowerSearchTerm)
        )
      ) {
        return false;
      }

      // Basic Filters
      if (activeFilters.category && lead.category !== activeFilters.category) {
        return false;
      }
      // Note: Stage filter is implicitly handled by grouping, but could be added here if needed for other views
      if (
        activeFilters.location &&
        !lead.location
          ?.toLowerCase()
          .includes(activeFilters.location.toLowerCase())
      ) {
        return false;
      }
      // Apply Date Range Filter (using lastContact for example)
      if (activeFilters.lastCommunicationDateRange?.from) {
        const fromDate = new Date(
          activeFilters.lastCommunicationDateRange.from
        );
        // Ensure 'toDate' includes the full end day, even if only one day is selected
        const toDate = activeFilters.lastCommunicationDateRange.to
          ? new Date(activeFilters.lastCommunicationDateRange.to)
          : new Date(activeFilters.lastCommunicationDateRange.from);

        // Set time components for accurate comparison across the entire day(s)
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        try {
          // Attempt to parse the lead's date string (assuming 'MMM d, yyyy' format)
          const leadDate = parse(lead.lastContact, "MMM d, yyyy", new Date());

          // Check if the parsed date is valid
          if (isNaN(leadDate.getTime())) {
            console.warn(
              `Invalid date format for lead ${lead.id}: ${lead.lastContact}. Excluding from date filter.`
            );
            return false; // Exclude leads with invalid dates
          }

          // Perform inclusive comparison: Check if leadDate is on or after fromDate AND on or before toDate
          if (!(leadDate >= fromDate && leadDate <= toDate)) {
            return false;
          }
        } catch (e) {
          console.error(
            `Error parsing or comparing date for lead ${lead.id}: ${lead.lastContact}`,
            e
          );
          return false; // Exclude on error
        }
      }

      // More Filters (from sheet)
      if (activeFilters.industry && lead.industry !== activeFilters.industry) {
        return false;
      }
      // TODO: Implement lastContactRange filter if needed
      if (
        activeFilters.scoreRange &&
        (lead.score < activeFilters.scoreRange[0] ||
          lead.score > activeFilters.scoreRange[1])
      ) {
        return false;
      }

      return true; // Lead passes all active filters
    });

    // Group the filtered leads by stage
    return stages.reduce((acc, stage) => {
      acc[stage.id] = filteredLeads.filter((lead) => lead.status === stage.id);
      return acc;
    }, {} as LeadsByStage);
  }, [stages, leads, activeFilters, searchTerm]); // Add dependencies

  // Calculate dynamic summary statistics using useMemo (based on ALL leads, not filtered ones)
  // Or adjust this calculation based on filteredLeads if summary should reflect filtered view
  const summaryStats = useMemo(() => {
    const openLeads = leads.filter(
      (lead) => lead.status !== "Won" && lead.status !== "Lost"
    );
    const wonLeads = leads.filter((lead) => lead.status === "Won");
    const lostLeads = leads.filter((lead) => lead.status === "Lost");

    const totalPipelineValue = openLeads.reduce(
      (sum, lead) => sum + (lead.value || 0),
      0
    );
    const averageDealSize =
      openLeads.length > 0 ? totalPipelineValue / openLeads.length : 0;
    const closedValue = wonLeads.reduce(
      (sum, lead) => sum + (lead.value || 0),
      0
    );
    const totalClosedDeals = wonLeads.length + lostLeads.length;
    const winRate =
      totalClosedDeals > 0 ? (wonLeads.length / totalClosedDeals) * 100 : 0;

    return {
      totalPipelineValue,
      averageDealSize,
      winRate,
      closedValue, // Using 'closedValue' instead of 'closedThisMonth' for clarity
    };
  }, [leads]); // Summary based on all leads

  // --- Filter and Search Handlers ---
  const handleFilterChange = (filters: ActiveFilters) => {
    setActiveFilters(filters);
  };

  // Debounced search handler
  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  const handleSearchChange = (term: string) => {
    debouncedSearch(term);
  };

  // --- Stage Action Handlers ---

  const handleAddStageClick = () => {
    setIsAddStageModalOpen(true); // Open the modal
  };

  // Callback function when a stage is successfully added
  const handleStageAdded = (newStage: PipelineStage) => {
    // Add the new stage to the state, maintaining order if possible
    // A simple append might be okay if order is handled by API/sorting later
    // Or fetch stages again: const updatedStages = await fetchPipelineStages(); setStages(updatedStages);
    setStages((prevStages) =>
      [...prevStages, newStage].sort((a, b) => a.order - b.order)
    );
  };

  const handleEditStageClick = (stage: PipelineStage) => {
    setCurrentStageToEdit(stage);
    setIsEditStageModalOpen(true); // Open the modal
  };

  // Callback function when a stage is successfully updated
  const handleStageUpdated = (updatedStage: PipelineStage) => {
    setStages((prevStages) =>
      prevStages
        .map((stage) => (stage.id === updatedStage.id ? updatedStage : stage))
        .sort((a, b) => a.order - b.order)
    );
    setCurrentStageToEdit(undefined); // Clear current stage after update
  };

  const handleDeleteStageClick = (stage: PipelineStage) => {
    setCurrentStageToDelete(stage);
    setIsDeleteStageModalOpen(true); // Open the confirmation dialog
  };

  // Callback function when a stage is confirmed deleted
  const handleStageDeleted = (deletedStageId: string) => {
    setStages((prevStages) =>
      prevStages.filter((stage) => stage.id !== deletedStageId)
    );
    // The mock handler automatically reassigns leads, so we don't need to refetch/update leads here
    // In a real backend, you might need to refetch leads or handle reassignment differently
    setCurrentStageToDelete(undefined); // Clear current stage after delete
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop - Update API and local state
  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    const originalLead = leads.find((l) => l.id === leadId);

    if (!originalLead || originalLead.status === targetStageId) {
      return; // No change needed
    }

    // Optimistic UI update
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: targetStageId } : lead
      )
    );

    try {
      await updateLead({ id: leadId, status: targetStageId });
      toast.success(`Lead moved to ${targetStageId}`);
    } catch (err) {
      console.error("Failed to update lead stage:", err);
      toast.error("Failed to move lead. Reverting.");
      // Revert UI on error
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, status: originalLead.status } : lead
        )
      );
    }
  };

  // Removed outer layout divs and Sidebar/Header components
  return (
    <>
      {" "}
      {/* Use Fragment as the top-level element */}
      {/* Header content (buttons) is removed as it's handled by MainLayout now */}
      {/* If these buttons are specific to this page, they need to be moved inside the page content */}
      {/* For now, assuming they were generic header actions */}
      {/* Removed wrapping div, content starts directly */}
      {/* Page Header Area */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold">Sales Pipeline</h1>
          {/* Add any page-specific actions here if needed */}
        </div>
        <p className="text-slate-500">
          Visualize and manage your deal flow. Drag leads between stages.
        </p>
      </div>
      {/* Filter Component */}
      <LeadFilter onSearch={handleSearchChange} onFilter={handleFilterChange} />
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}
      {/* Pipeline Board */}
      <div className="flex space-x-4 overflow-x-auto pb-6">
        {isLoadingStages
          ? // Skeleton loaders for stages
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-w-[280px] w-[280px] flex-shrink-0"
              >
                <Skeleton className="h-10 w-full rounded-t-lg" />
                <Skeleton className="h-[500px] w-full rounded-b-lg mt-0.5" />
              </div>
            ))
          : stages.map((stage) => (
              <div
                key={stage.id}
                className="min-w-[280px] w-[280px] flex-shrink-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)} // Pass stage.id
              >
                {/* Use stage.color or default */}
                <div
                  className={`rounded-t-lg px-3 py-2 ${
                    stage.color || "bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate pr-2">{stage.name}</h3>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <span className="text-xs font-medium bg-white/50 rounded-full px-2 py-0.5">
                        {leadsByStage[stage.id]?.length || 0}
                      </span>
                      {/* Stage Action Buttons */}
                      <Button
                        variant="ghost"
                        size="icon" // Use standard icon size
                        className="h-5 w-5 text-slate-500 hover:text-slate-700"
                        onClick={() => handleEditStageClick(stage)}
                        title={`Edit stage: ${stage.name}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon" // Use standard icon size
                        className="h-5 w-5 text-slate-500 hover:text-red-600"
                        onClick={() => handleDeleteStageClick(stage)}
                        title={`Delete stage: ${stage.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-t-none p-2 min-h-[500px]">
                  {isLoadingLeads ? (
                    // Skeleton loaders for leads within a stage
                    <div className="space-y-2">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    leadsByStage[stage.id]?.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-slate-100 cursor-move hover:border-blue-200 transition-all"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                      >
                        <h4 className="font-medium text-slate-800">
                          {lead.name}
                        </h4>
                        <p className="text-sm text-slate-500">{lead.company}</p>
                        {/* Display Score & Value */}
                        <div className="flex justify-between items-center mt-2">
                          {/* Display Score */}
                          {lead.score !== undefined && (
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                lead.score
                              )}`}
                            >
                              Score: {lead.score}%
                            </span>
                          )}
                          {/* Display Value */}
                          {lead.value !== undefined && (
                            <span className="text-sm font-medium text-slate-700">
                              {formatCurrency(lead.value)}
                            </span>
                          )}
                        </div>
                        {/* Display Location */}
                        {lead.location && (
                          <div className="flex items-center mt-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
                            {/* Assuming MapPin is imported */}
                            <span>{lead.location}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
        {/* Add Stage Button Column */}
        {!isLoadingStages && (
          <div className="min-w-[280px] w-[280px] flex-shrink-0 flex items-center justify-center">
            <Button
              variant="outline"
              className="w-full h-12 border-dashed"
              onClick={handleAddStageClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>
        )}
      </div>
      {/* Render the Add Stage Dialog */}
      <AddStageDialog
        isOpen={isAddStageModalOpen}
        onClose={() => setIsAddStageModalOpen(false)}
        onStageAdded={handleStageAdded}
      />
      {/* Render the Edit Stage Dialog */}
      <EditStageDialog
        isOpen={isEditStageModalOpen}
        onClose={() => {
          setIsEditStageModalOpen(false);
          setCurrentStageToEdit(undefined); // Clear stage on close
        }}
        stage={currentStageToEdit}
        onStageUpdated={handleStageUpdated}
      />
      {/* Render the Delete Stage Confirmation Dialog */}
      <DeleteStageConfirmation
        isOpen={isDeleteStageModalOpen}
        onClose={() => {
          setIsDeleteStageModalOpen(false);
          setCurrentStageToDelete(undefined); // Clear stage on close
        }}
        stage={currentStageToDelete}
        onConfirmDelete={handleStageDeleted}
      />
      {/* Summary Stats - Now Dynamic */}
      <div className="glass-card p-6 mt-8">
        <h3 className="font-medium text-slate-700 mb-4">Pipeline Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Display calculated values */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm text-slate-600">Total Pipeline Value</h4>
            <p className="text-2xl font-semibold mt-1">
              {isLoadingLeads ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                formatCurrency(summaryStats.totalPipelineValue)
              )}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm text-slate-600">Average Deal Size</h4>
            <p className="text-2xl font-semibold mt-1">
              {isLoadingLeads ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                formatCurrency(summaryStats.averageDealSize)
              )}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="text-sm text-slate-600">Win Rate</h4>
            <p className="text-2xl font-semibold mt-1">
              {isLoadingLeads ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                `${summaryStats.winRate.toFixed(0)}%`
              )}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm text-slate-600">Total Closed Value</h4>{" "}
            {/* Renamed label */}
            <p className="text-2xl font-semibold mt-1">
              {isLoadingLeads ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                formatCurrency(summaryStats.closedValue)
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PipelinePage;
