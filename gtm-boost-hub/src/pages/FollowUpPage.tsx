import React, { useMemo } from "react";
import { Link } from "react-router-dom"; // Import Link
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, parse, isSameDay } from "date-fns";
import LeadTable, { Lead } from "../components/LeadTable";
import { fetchLeads } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon

// Helper function to parse multiple date formats (copied from Sidebar)
const parseMultipleFormats = (
  dateString: string,
  formats: string[]
): Date | null => {
  for (const format of formats) {
    try {
      const parsedDate = parse(dateString, format, new Date());
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (e) {
      // Ignore parsing errors for specific formats
    }
  }
  return null;
};

const FollowUpPage: React.FC = () => {
  // Fetch leads data using React Query
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    error: errorLeads,
  } = useQuery<Lead[]>({
    queryKey: ["leads"], // Use the same query key as MainLayout/LeadsPage to potentially use cached data
    queryFn: fetchLeads,
  });

  // Filter leads for today's follow-up
  const followupLeads = useMemo(() => {
    if (!leadsData) return [];

    const today = new Date();
    const possibleFormats = ["yyyy-MM-dd", "MMM d, yyyy", "M/d/yyyy"]; // Consistent formats

    return leadsData.filter((lead) => {
      if (!lead.nextFollowUp) {
        return false;
      }
      const followUpDate = parseMultipleFormats(
        lead.nextFollowUp,
        possibleFormats
      );
      // Check if the date was parsed successfully and is today
      return followUpDate && isSameDay(followUpDate, today);
    });
  }, [leadsData]); // Recalculate when leadsData changes

  // WhatsApp handler (copied from LeadsPage)
  const handleWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp");
  };

  return (
    <>
      {/* Add Back Button */}
      <Link to="/leads" className="inline-block mb-4">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Today's Follow-ups ({followupLeads.length})
        </h1>
        <p className="text-slate-600">
          Leads scheduled for follow-up today (
          {format(new Date(), "MMMM d, yyyy")}).
        </p>
      </div>

      <div className="glass-card p-6">
        {isLoadingLeads ? (
          <Skeleton className="h-96" /> // Show skeleton while loading
        ) : errorLeads ? (
          <div className="text-red-500 text-center py-10">
            Error loading leads: {errorLeads.message}
          </div>
        ) : followupLeads.length === 0 ? (
          <div className="text-slate-500 text-center py-10">
            No leads scheduled for follow-up today.
          </div>
        ) : (
          // Pass the filtered leads to LeadTable
          // Note: LeadTable handles its own actions like edit/delete internally
          // We might need to pass handleWhatsApp if LeadTable doesn't define it.
          // Let's assume LeadTable handles WhatsApp for now based on its code.
          // If not, we'll need to adjust LeadTable or pass the handler.
          <LeadTable leads={followupLeads} />
        )}
      </div>
    </>
  );
};

export default FollowUpPage;
