import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  Download,
  FileText,
  Table,
  Filter,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  LineChart,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FeatureGate } from "@/components/FeatureGate";
import { toast } from "sonner";
import { fetchLeads } from "@/lib/api";
import type { Lead } from "@/types/lead";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

// Report Types
type ReportType =
  | "lead-generation"
  | "pipeline"
  | "conversion"
  | "revenue"
  | "activity";
type ExportFormat = "csv" | "excel" | "pdf";

interface ReportConfig {
  type: ReportType;
  dateRange: {
    from: Date;
    to: Date;
  };
  filters: {
    status?: string[];
    source?: string[];
    score?: [number, number];
  };
}

const ReportsPage: React.FC = () => {
  const { currentPlan } = useSubscription();
  const [selectedReport, setSelectedReport] =
    useState<ReportType>("lead-generation");
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");

  // Fetch leads data with proper error handling
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    error: leadsError,
  } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Log any errors for debugging
  React.useEffect(() => {
    if (leadsError) {
      console.error("Error fetching leads:", leadsError);
      toast.error("Failed to load leads data. Please try again later.");
    }
  }, [leadsError]);

  // Calculate report data based on selected report type
  const reportData = useMemo(() => {
    if (!leadsData) return [];

    console.log("Processing leads data:", leadsData.length, "leads"); // Debug log

    const filteredLeads = leadsData.filter((lead) => {
      const leadDate = parseISO(lead.lastContact);
      return leadDate >= dateRange.from && leadDate <= dateRange.to;
    });

    console.log("Filtered leads:", filteredLeads.length, "leads"); // Debug log

    switch (selectedReport) {
      case "lead-generation":
        return filteredLeads.map((lead) => ({
          date: format(parseISO(lead.lastContact), "MMM dd, yyyy"),
          name: lead.name,
          company: lead.company || "",
          source: lead.source || "",
          status: lead.status || "",
        }));
      case "pipeline":
        return filteredLeads.map((lead) => ({
          stage: lead.status,
          name: lead.name,
          company: lead.company || "",
          value: lead.value || 0,
          probability: lead.score,
          expectedClose: lead.lastContact,
        }));
      case "conversion":
        return filteredLeads.map((lead) => ({
          source: lead.source || "",
          total: 1,
          converted: lead.status === "Closed" ? 1 : 0,
          conversionRate: lead.status === "Closed" ? "100%" : "0%",
        }));
      case "revenue":
        return filteredLeads
          .filter((lead) => lead.status === "Closed")
          .map((lead) => ({
            date: format(parseISO(lead.lastContact), "MMM dd, yyyy"),
            name: lead.name,
            company: lead.company || "",
            value: lead.value || 0,
          }));
      case "activity":
        return filteredLeads.map((lead) => ({
          date: format(parseISO(lead.lastContact), "MMM dd, yyyy"),
          name: lead.name,
          company: lead.company || "",
          activity: "Contact",
          notes: lead.notes || "",
        }));
      default:
        return [];
    }
  }, [leadsData, selectedReport, dateRange]);

  // Show loading state
  if (isLoadingLeads) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (leadsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="mt-4 text-lg font-semibold">Error Loading Reports</h3>
          <p className="mt-2 text-muted-foreground">
            There was a problem loading the reports data. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!leadsData || leadsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="mt-4 text-lg font-semibold">No Reports Available</h3>
          <p className="mt-2 text-muted-foreground">
            There are no leads data available to generate reports.
          </p>
        </div>
      </div>
    );
  }

  // Handle report export
  const handleExport = async (format: ExportFormat) => {
    try {
      // In a real app, this would call an API endpoint to generate the report
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate and export detailed reports about your leads and pipeline
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DateRangePicker
            date={dateRange}
            onDateChange={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />
          <Select
            value={exportFormat}
            onValueChange={(value: ExportFormat) => setExportFormat(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Export Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExport(exportFormat)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === "lead-generation" ? "border-primary" : ""
          }`}
          onClick={() => setSelectedReport("lead-generation")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Lead Generation
            </CardTitle>
            <CardDescription>Track new leads and their sources</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === "pipeline" ? "border-primary" : ""
          }`}
          onClick={() => setSelectedReport("pipeline")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Pipeline
            </CardTitle>
            <CardDescription>
              Monitor deals in your sales pipeline
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === "conversion" ? "border-primary" : ""
          }`}
          onClick={() => setSelectedReport("conversion")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Conversion
            </CardTitle>
            <CardDescription>
              Analyze conversion rates by source
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === "revenue" ? "border-primary" : ""
          }`}
          onClick={() => setSelectedReport("revenue")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Revenue
            </CardTitle>
            <CardDescription>Track revenue and deal values</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedReport === "activity" ? "border-primary" : ""
          }`}
          onClick={() => setSelectedReport("activity")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Activity
            </CardTitle>
            <CardDescription>
              Monitor lead interactions and activities
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Table className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <PieChart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TableComponent>
            <TableHeader>
              <TableRow>
                {selectedReport === "lead-generation" && (
                  <>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </>
                )}
                {selectedReport === "pipeline" && (
                  <>
                    <TableHead>Stage</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Expected Close</TableHead>
                  </>
                )}
                {selectedReport === "conversion" && (
                  <>
                    <TableHead>Source</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Converted</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </>
                )}
                {selectedReport === "revenue" && (
                  <>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                  </>
                )}
                {selectedReport === "activity" && (
                  <>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Notes</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {typeof value === "string" || typeof value === "number"
                        ? value
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableComponent>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
