import React, { useMemo, useEffect, useState } from "react"; // Import useMemo and useEffect
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  LineChart as LineChartIcon,
  Calendar as CalendarIcon,
  BriefcaseIcon,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowRight,
} from "lucide-react";
// Chart imports
import {
  Line,
  LineChart, // Reverted recharts import
  Pie,
  PieChart, // Reverted recharts import
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
import StatsCard from "../components/StatsCard";
import SubscriptionInfo from "../components/SubscriptionInfo";
import { Button } from "@/components/ui/button";
import { fetchLeads, fetchSubscriptionInfo } from "@/lib/api";
import { Lead } from "@/types/lead";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, startOfMonth, subDays } from "date-fns"; // Removed unused getMonth, getYear
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TimeRangeSelector, { TimeRange } from "@/components/TimeRangeSelector";
import { supabase } from "@/lib/supabase";

// Define colors for the pie chart
const PIE_CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF4560",
  "#775DD0",
  "#3F51B5",
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentPlan } = useSubscription();
  const [timeRange, setTimeRange] = useState<TimeRange>("30");

  // Fetch Leads Data
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    error: errorLeads,
  } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  // Fetch Subscription Info
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error: errorSubscription,
  } = useQuery({
    queryKey: ["subscriptionInfo"],
    queryFn: fetchSubscriptionInfo,
  });

  // Filter leads based on selected time range
  const filteredLeads = useMemo(() => {
    if (!leadsData) return [];

    const now = new Date();
    const daysAgo = subDays(now, parseInt(timeRange));

    return leadsData.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= daysAgo;
    });
  }, [leadsData, timeRange]);

  // Calculate dashboard metrics from filtered leads
  const calculatedStats = useMemo(() => {
    if (!filteredLeads.length) {
      return {
        totalLeads: 0,
        meetingsBooked: 0,
        dealsClosed: 0,
        conversionRate: 0,
      };
    }

    const totalLeads = filteredLeads.length;
    const meetingsBooked = filteredLeads.filter(
      (lead) => lead.status.toLowerCase() === "discovery meeting"
    ).length;
    const dealsClosed = filteredLeads.filter(
      (lead) => lead.status.toLowerCase() === "won"
    ).length;
    const conversionRate =
      totalLeads > 0 ? Math.round((dealsClosed / totalLeads) * 100) : 0;

    return { totalLeads, meetingsBooked, dealsClosed, conversionRate };
  }, [filteredLeads]);

  // Calculate Lead Generation Performance Data (Monthly)
  const leadGenPerformanceData = useMemo(() => {
    if (!filteredLeads.length) return [];

    const monthlyLeads: { [key: string]: number } = {};
    filteredLeads.forEach((lead) => {
      try {
        let contactDate: Date | null = null;
        try {
          contactDate = parseISO(lead.lastContact);
        } catch (isoError) {
          console.warn(
            `Could not parse date for lead ${lead.id}: ${lead.lastContact}`
          );
        }
        if (contactDate && !isNaN(contactDate.getTime())) {
          const monthKey = format(startOfMonth(contactDate), "yyyy-MM");
          monthlyLeads[monthKey] = (monthlyLeads[monthKey] || 0) + 1;
        }
      } catch (e) {
        console.error(
          `Error processing date for lead gen chart: ${lead.id}`,
          e
        );
      }
    });

    const last12Months: string[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last12Months.push(format(date, "yyyy-MM"));
    }

    return last12Months.map((monthKey) => ({
      month: format(parseISO(monthKey + "-01"), "MMM yy"),
      leads: monthlyLeads[monthKey] || 0,
    }));
  }, [filteredLeads]);

  // Calculate Lead Sources Data
  const leadSourcesData = useMemo(() => {
    if (!filteredLeads.length) return [];

    const sourceCounts: { [key: string]: number } = {};
    filteredLeads.forEach((lead) => {
      const source = lead.source?.trim() || "Unknown";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    return Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value,
      fill: "",
    }));
  }, [filteredLeads]);

  // Chart Configurations
  const leadGenChartConfig: ChartConfig = {
    // Added type annotation
    leads: { label: "Leads", color: "hsl(var(--chart-1))" },
  };

  const leadSourcesChartConfig = useMemo(() => {
    const config: ChartConfig = {}; // Added type annotation
    const categories =
      filteredLeads?.map((lead) => lead.source?.trim() || "Unknown") || [];
    const uniqueSources = [...new Set(categories)];
    uniqueSources.forEach((sourceName, index) => {
      config[sourceName] = {
        label: sourceName,
        color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      };
    });
    return config;
  }, [filteredLeads]);

  // Calculate Meetings Booked per Month Data
  const meetingsBookedMonthlyData = useMemo(() => {
    if (!filteredLeads.length) return [];

    const monthlyMeetings: { [key: string]: number } = {};
    filteredLeads
      .filter((lead) => lead.status.toLowerCase() === "discovery meeting")
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

    const last12Months: string[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last12Months.push(format(date, "yyyy-MM"));
    }

    return last12Months.map((monthKey) => ({
      month: format(parseISO(monthKey + "-01"), "MMM yy"),
      meetings: monthlyMeetings[monthKey] || 0,
    }));
  }, [filteredLeads]);

  // Chart config for Meetings Booked
  const meetingsChartConfig: ChartConfig = {
    // Added type annotation
    meetings: { label: "Meetings", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
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

      {/* Key Metrics Section */}
      <h2 className="font-semibold text-xl mt-10 mb-6">Key Metrics</h2>
      {isLoadingLeads ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : errorLeads ? (
        <div className="text-red-500 mb-10">Error loading leads data.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Leads"
            value={String(calculatedStats.totalLeads)}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            bgColor="bg-blue-50/50"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${calculatedStats.conversionRate}%`}
            icon={<LineChartIcon className="h-5 w-5 text-green-600" />}
            bgColor="bg-green-50/50"
          />
          <StatsCard
            title="Meetings Booked"
            value={String(calculatedStats.meetingsBooked)}
            icon={<CalendarIcon className="h-5 w-5 text-purple-600" />}
            bgColor="bg-purple-50/50"
          />
          <StatsCard
            title="Deals Closed"
            value={String(calculatedStats.dealsClosed)}
            icon={<BriefcaseIcon className="h-5 w-5 text-amber-600" />}
            bgColor="bg-amber-50/50"
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {" "}
        {/* Adjusted grid for responsiveness */}
        {/* Lead Generation Chart */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Lead Generation</h3>
            <Button variant="ghost" className="text-sm h-8">
              Details
            </Button>
          </div>
          <ChartContainer config={leadGenChartConfig} className="h-64 w-full">
            <LineChart
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="leads"
                type="monotone"
                stroke="var(--color-leads)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
        {/* Meetings Booked Chart */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Meetings Booked</h3>
            <Button variant="ghost" className="text-sm h-8">
              Details
            </Button>
          </div>
          <ChartContainer config={meetingsChartConfig} className="h-64 w-full">
            <LineChart
              accessibilityLayer
              data={meetingsBookedMonthlyData}
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="meetings"
                type="monotone"
                stroke="var(--color-meetings)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
        {/* Lead Sources Chart */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Lead Sources</h3>
            <Button variant="ghost" className="text-sm h-8">
              Details
            </Button>
          </div>
          <ChartContainer
            config={leadSourcesChartConfig}
            className="h-64 w-full"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={leadSourcesData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {leadSourcesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      leadSourcesChartConfig[entry.name]?.color || "#CCCCCC"
                    }
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                verticalAlign="bottom"
                height={40}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* AI Insights CTA */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Ready to get AI-powered insights?
            </h3>
            <p className="text-slate-600 mb-6 md:mb-0">
              Unlock the full potential of GTMcentric with GTMCentric AI
            </p>
          </div>
          <Button className="btn-gradient">
            Upgrade to PRO
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
