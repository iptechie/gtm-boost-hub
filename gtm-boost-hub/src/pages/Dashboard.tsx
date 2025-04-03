import React, { useMemo } from "react"; // Import useMemo
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  LineChart as LineChartIcon, // Rename icon imports to avoid conflict
  Calendar as CalendarIcon,
  BriefcaseIcon,
  TrendingUp,
  PieChart as PieChartIcon, // Rename icon imports to avoid conflict
  ArrowRight,
} from "lucide-react";
// Chart imports
import {
  Line,
  LineChart as RechartsLineChart, // Renamed recharts import
  Pie,
  PieChart as RechartsPieChart, // Renamed recharts import
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell, // Import Cell for Pie chart colors
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig, // Import ChartConfig type
} from "@/components/ui/chart";
// Removed Header import
import StatsCard from "../components/StatsCard";
import SubscriptionInfo from "../components/SubscriptionInfo";
// Removed Sidebar import
import { Button } from "@/components/ui/button";
// Import fetchLeads and Lead type, remove fetchDashboardStats
import { fetchLeads, fetchSubscriptionInfo } from "@/lib/api";
import { Lead } from "@/components/LeadTable";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, startOfMonth, getMonth, getYear } from "date-fns"; // Date functions

// Define colors for the pie chart
const PIE_CHART_COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#FF4560", // Red
  "#775DD0", // Indigo
  "#3F51B5", // Deep Purple
];

const Dashboard = () => {
  // Fetch Leads Data
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    error: errorLeads,
  } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Fetch Subscription Info (remains the same)
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription, // Keep this
    error: errorSubscription, // Keep this
  } = useQuery({
    queryKey: ["subscriptionInfo"],
    queryFn: fetchSubscriptionInfo,
  });

  // Calculate dashboard metrics from leadsData - Restoring
  const calculatedStats = useMemo(() => {
    if (!leadsData) {
      return {
        totalLeads: 0,
        meetingsBooked: 0,
        dealsClosed: 0,
        conversionRate: 0,
      };
    }

    const totalLeads = leadsData.length;
    const meetingsBooked = leadsData.filter(
      (lead) => lead.status.toLowerCase() === "discovery meeting" // Match the stage name
    ).length;
    const dealsClosed = leadsData.filter(
      (lead) => lead.status.toLowerCase() === "won"
    ).length;
    const conversionRate =
      totalLeads > 0 ? Math.round((dealsClosed / totalLeads) * 100) : 0;

    return {
      totalLeads,
      meetingsBooked,
      dealsClosed,
      conversionRate,
    };
  }, [leadsData]);
  // End restoring calculatedStats

  // Calculate Lead Generation Performance Data (Monthly) - Restoring
  const leadGenPerformanceData = useMemo(() => {
    if (!leadsData) return [];

    const monthlyLeads: { [key: string]: number } = {}; // Key: YYYY-MM

    leadsData.forEach((lead) => {
      try {
        let contactDate: Date | null = null;
        // Try parsing ISO format first, then fallback
        try {
          contactDate = parseISO(lead.lastContact);
        } catch (isoError) {
          // If ISO parsing fails, log a warning or handle differently
          // For now, we'll assume dates are parseable or skip
          console.warn(
            `Could not parse date for lead ${lead.id}: ${lead.lastContact}`
          );
        }

        if (contactDate && !isNaN(contactDate.getTime())) {
          const monthKey = format(startOfMonth(contactDate), "yyyy-MM"); // Group by start of month
          monthlyLeads[monthKey] = (monthlyLeads[monthKey] || 0) + 1;
        }
      } catch (e) {
        console.error(
          `Error processing date for lead gen chart: ${lead.id}`,
          e
        );
      }
    });

    // Get the last 12 months including the current month
    const last12Months: string[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last12Months.push(format(date, "yyyy-MM"));
    }

    // Map counts to the last 12 months, filling gaps with 0
    return last12Months.map((monthKey) => ({
      month: format(parseISO(monthKey + "-01"), "MMM yy"), // Display format: Jan 25
      leads: monthlyLeads[monthKey] || 0,
    }));
  }, [leadsData]);
  // End restoring leadGenPerformanceData

  // Calculate Lead Sources Data - Restoring
  const leadSourcesData = useMemo(() => {
    if (!leadsData) return [];

    const sourceCounts: { [key: string]: number } = {};
    leadsData.forEach((lead) => {
      // Use category as source, default to 'Unknown' if empty or null
      const source = lead.category?.trim() || "Unknown";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    // Convert to array format suitable for Recharts Pie chart
    return Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value,
      fill: "", // Placeholder, will be set by ChartConfig
    }));
  }, [leadsData]);
  // End restoring leadSourcesData

  // Chart Configurations - Restoring leadGenChartConfig
  const leadGenChartConfig = {
    leads: {
      label: "Leads",
      color: "hsl(var(--chart-1))", // Use CSS variable defined by chart.tsx
    },
  };
  // Restoring leadSourcesChartConfig
  const leadSourcesChartConfig = useMemo(() => {
    const config: Record<string, any> = {};
    // Create the config based on unique source names found in the data (refactored for clarity)
    const categories = leadsData?.map(lead => lead.category?.trim() || "Unknown") || [];
    const uniqueSources = [...new Set(categories)];
    uniqueSources.forEach((sourceName, index) => {
      config[sourceName] = {
        label: sourceName,
        color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      };
    });
    // Return only the config object, don't mutate leadSourcesData here
    return config;
  }, [leadsData]);
  // End restoring leadSourcesChartConfig

  // Calculate Meetings Booked per Month Data - Temporarily commented out
  const meetingsBookedMonthlyData = useMemo(() => {
    if (!leadsData) return [];

    const monthlyMeetings: { [key: string]: number } = {}; // Key: YYYY-MM

    leadsData
      .filter((lead) => lead.status.toLowerCase() === "discovery meeting") // Filter for meetings booked
      .forEach((lead) => {
        try {
          let contactDate: Date | null = null;
          try {
            contactDate = parseISO(lead.lastContact);
          } catch (isoError) {
            console.warn(
              `Could not parse date for meeting lead ${lead.id}: ${lead.lastContact}`
            );
          }

          if (contactDate && !isNaN(contactDate.getTime())) {
            const monthKey = format(startOfMonth(contactDate), "yyyy-MM");
            monthlyMeetings[monthKey] = (monthlyMeetings[monthKey] || 0) + 1;
          }
        } catch (e) {
          console.error(
            `Error processing date for meeting chart: ${lead.id}`,
            e
          );
        }
      });

    // Get the last 12 months including the current month
    const last12Months: string[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last12Months.push(format(date, "yyyy-MM"));
    }

    // Map counts to the last 12 months, filling gaps with 0
    return last12Months.map((monthKey) => ({
      month: format(parseISO(monthKey + "-01"), "MMM yy"),
      meetings: monthlyMeetings[monthKey] || 0,
    }));
  }, [leadsData]);


  // Chart config for Meetings Booked (defined as constant) - Temporarily commented out
  const meetingsChartConfig = {
    meetings: {
      label: "Meetings",
      color: "hsl(var(--chart-2))", // Use a different chart color variable
    },
  };
  */

  return (
    <>
      {/* Use Fragment as the top-level element */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-slate-600">
          Here's what's happening with your GTM strategy.
        </p>
      </div>
      {/* Subscription Info */}
      {isLoadingSubscription ? (
        <Skeleton className="h-24 mb-10" />
      ) : errorSubscription ? (
        <div className="text-red-500 mb-10">
          Error loading subscription info.
        </div>
      ) : subscriptionData ? (
        <SubscriptionInfo
          plan={subscriptionData.plan}
          daysRemaining={subscriptionData.daysRemaining}
          usedLeads={subscriptionData.usedLeads}
          maxLeads={subscriptionData.maxLeads}
        />
      ) : null}
      {/* Key Metrics and Stats Cards - Restoring */}
      <h2 className="font-semibold text-xl mt-10 mb-6">Key Metrics</h2>
      {isLoadingLeads ? ( // Check leads loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : errorLeads ? ( // Check leads error state
        <div className="text-red-500 mb-10">Error loading leads data.</div>
      ) : leadsData ? ( // Check if leadsData exists
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Leads"
            value={String(calculatedStats.totalLeads)} // Use calculated value
            icon={<Users className="h-5 w-5 text-blue-600" />}
            // change={0} // Remove or set change to 0 as it's not calculated
            bgColor="bg-blue-50/50"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${calculatedStats.conversionRate}%`} // Use calculated value
            icon={<LineChartIcon className="h-5 w-5 text-green-600" />} {/* Use renamed icon */}
            // change={0}
            bgColor="bg-green-50/50"
          />
          <StatsCard
            title="Meetings Booked"
            value={String(calculatedStats.meetingsBooked)} // Use calculated value
            icon={<CalendarIcon className="h-5 w-5 text-purple-600" />}
            // change={0}
            bgColor="bg-purple-50/50"
          />
          <StatsCard
            title="Deals Closed"
            value={String(calculatedStats.dealsClosed)} // Use calculated value
            icon={<BriefcaseIcon className="h-5 w-5 text-amber-600" />}
            // change={0}
            bgColor="bg-amber-50/50"
          />
        </div>
      ) : null}
      {/* End restoring Key Metrics and Stats Cards */}
      {/* Charts section - Partially restoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Lead Generation Chart - Restoring */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Lead Generation</h3>
            <Button variant="ghost" className="text-sm h-8">
              Details
            </Button>
          </div>
          <ChartContainer config={leadGenChartConfig} className="h-64 w-full">
            <RechartsLineChart
              accessibilityLayer
              data={leadGenPerformanceData}
              margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line dataKey="leads" type="monotone" stroke="var(--color-leads)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ChartContainer>
        </div>
        {/* End restoring Lead Generation Chart */}
        {/* Other charts and closing grid div still commented out */}
        {/*
        <div className="glass-card p-6">
          // ... Meetings Booked Chart JSX ...
        </div>
        <div className="glass-card p-6">
          // ... Lead Sources Chart JSX ...
        </div>
        {/* Other charts still commented out */}
        {/*
        <div className="glass-card p-6">
          // ... Meetings Booked Chart JSX ...
        </div>
        <div className="glass-card p-6">
          // ... Lead Sources Chart JSX ...
        </div>
         */}
      </div> {/* Closing div for the grid - Now uncommented */}
      {/* End charts section */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Ready to get AI-powered insights?
            </h3>
            <p className="text-slate-600 mb-6 md:mb-0">
              Unlock the full potential of GTMcentric with Gemma AI integration.
            </p>
          </div>
          <Button className="btn-gradient">
            Set up Gemma API
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Removed potentially extra closing div */}
    </>
  );
};

export default Dashboard;
