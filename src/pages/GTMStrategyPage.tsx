import React, { useState } from "react";
// Removed Header import
// Removed Sidebar import
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  Circle,
  Brain,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockGTMStrategy } from "@/mocks/mockData";
import { GTMStrategy, GTMStrategyItem } from "@/types/strategy";

interface MarketAnalysis {
  marketSize: string;
  growthRate: string;
  totalAddressableMarket: string;
  keyTrends: string[];
  competitors: string[];
  opportunities: string[];
  idealCustomerProfile: {
    industry: string;
    companySize: string;
    painPoints: string[];
    decisionMakers: string[];
    budget: string;
  };
}

interface PositioningStrategy {
  valueProposition: string;
  targetAudience: string;
  keyDifferentiators: string[];
  messaging: string;
}

interface ChannelStrategy {
  channels: {
    name: string;
    priority: "High" | "Medium" | "Low";
    budget: string;
    metrics: string[];
  }[];
}

interface GTMStrategyTemplate {
  id: string;
  name: string;
  description: string;
  type: "SaaS" | "Enterprise" | "PLG" | "MarketExpansion";
  items: GTMStrategyItem[];
}

const GTMStrategyPage: React.FC = () => {
  const [activeStrategy, setActiveStrategy] =
    useState<GTMStrategy>(mockGTMStrategy);
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(
    null
  );
  const [positioningStrategy, setPositioningStrategy] =
    useState<PositioningStrategy | null>(null);
  const [channelStrategy, setChannelStrategy] =
    useState<ChannelStrategy | null>(null);
  const [templates, setTemplates] = useState<GTMStrategyTemplate[]>([
    {
      id: "1",
      name: "SaaS GTM Framework",
      description: "Complete framework for software-as-a-service products",
      type: "SaaS",
      items: [
        {
          id: "1",
          title: "Product-Market Fit Analysis",
          description:
            "Validate product-market fit and identify target segments",
          status: "Not Started",
          progress: 0,
          assignedTo: "Product Team",
          dueDate: new Date().toISOString(),
          notes: "Focus on early adopters and feedback loops",
          type: "Analysis",
        },
        {
          id: "2",
          title: "Pricing Strategy",
          description: "Develop pricing model and packaging",
          status: "Not Started",
          progress: 0,
          assignedTo: "Product Team",
          dueDate: new Date().toISOString(),
          notes: "Consider freemium model and tiered pricing",
          type: "Strategy",
        },
        {
          id: "3",
          title: "Customer Acquisition",
          description: "Define acquisition channels and tactics",
          status: "Not Started",
          progress: 0,
          assignedTo: "Marketing Team",
          dueDate: new Date().toISOString(),
          notes: "Focus on content marketing and partnerships",
          type: "Execution",
        },
      ],
    },
    {
      id: "2",
      name: "Enterprise Sales Framework",
      description: "Framework designed for complex, high-value B2B sales",
      type: "Enterprise",
      items: [
        {
          id: "1",
          title: "Enterprise Buyer Journey",
          description: "Map out enterprise buying process and stakeholders",
          status: "Not Started",
          progress: 0,
          assignedTo: "Sales Team",
          dueDate: new Date().toISOString(),
          notes: "Include procurement and security requirements",
          type: "Analysis",
        },
        {
          id: "2",
          title: "Sales Enablement",
          description: "Develop sales tools and training materials",
          status: "Not Started",
          progress: 0,
          assignedTo: "Sales Team",
          dueDate: new Date().toISOString(),
          notes: "Focus on ROI calculators and case studies",
          type: "Execution",
        },
        {
          id: "3",
          title: "Partnership Strategy",
          description: "Identify and engage strategic partners",
          status: "Not Started",
          progress: 0,
          assignedTo: "Business Development",
          dueDate: new Date().toISOString(),
          notes: "Focus on system integrators and resellers",
          type: "Strategy",
        },
      ],
    },
    {
      id: "3",
      name: "Product-Led Growth",
      description: "Framework for user-focused acquisition and expansion",
      type: "PLG",
      items: [
        {
          id: "1",
          title: "User Onboarding",
          description: "Design frictionless onboarding experience",
          status: "Not Started",
          progress: 0,
          assignedTo: "Product Team",
          dueDate: new Date().toISOString(),
          notes: "Focus on time-to-value and activation metrics",
          type: "Execution",
        },
        {
          id: "2",
          title: "Product Analytics",
          description: "Implement usage tracking and analytics",
          status: "Not Started",
          progress: 0,
          assignedTo: "Data Team",
          dueDate: new Date().toISOString(),
          notes: "Track key user behaviors and conversion points",
          type: "Analysis",
        },
        {
          id: "3",
          title: "Growth Loops",
          description: "Design and implement viral growth mechanisms",
          status: "Not Started",
          progress: 0,
          assignedTo: "Growth Team",
          dueDate: new Date().toISOString(),
          notes: "Focus on referral and sharing features",
          type: "Strategy",
        },
      ],
    },
    {
      id: "4",
      name: "Market Expansion",
      description: "Framework for entering new markets or segments",
      type: "MarketExpansion",
      items: [
        {
          id: "1",
          title: "Market Research",
          description: "Analyze new market opportunities and requirements",
          status: "Not Started",
          progress: 0,
          assignedTo: "Market Research",
          dueDate: new Date().toISOString(),
          notes: "Focus on local regulations and cultural factors",
          type: "Analysis",
        },
        {
          id: "2",
          title: "Localization Strategy",
          description: "Adapt product and messaging for new markets",
          status: "Not Started",
          progress: 0,
          assignedTo: "Product Team",
          dueDate: new Date().toISOString(),
          notes: "Consider language, currency, and compliance",
          type: "Strategy",
        },
        {
          id: "3",
          title: "Partnership Development",
          description: "Build local partnerships and distribution channels",
          status: "Not Started",
          progress: 0,
          assignedTo: "Business Development",
          dueDate: new Date().toISOString(),
          notes: "Focus on local market expertise",
          type: "Execution",
        },
      ],
    },
  ]);

  const handleStartAnalysis = async () => {
    if (!prompt.trim()) {
      toast.error("Please provide a prompt to generate market analysis");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call to generate market analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMarketAnalysis({
        marketSize: "$2.5B",
        growthRate: "15% YoY",
        totalAddressableMarket: "$5.8B",
        keyTrends: [
          "Increasing demand for AI-powered solutions",
          "Shift towards cloud-based platforms",
          "Growing focus on customer experience",
        ],
        competitors: [
          "Competitor A - 35% market share",
          "Competitor B - 25% market share",
          "Competitor C - 20% market share",
        ],
        opportunities: [
          "Untapped SMB market segment",
          "Integration with existing enterprise systems",
          "Industry-specific solutions",
        ],
        idealCustomerProfile: {
          industry: "Technology, SaaS",
          companySize: "50-500 employees",
          painPoints: [
            "Manual processes slowing down operations",
            "Lack of data-driven insights",
            "Difficulty in scaling operations",
          ],
          decisionMakers: [
            "Chief Revenue Officer",
            "VP of Sales",
            "Marketing Director",
          ],
          budget: "$50,000 - $200,000 annually",
        },
      });
      toast.success("Market analysis generated successfully!");
    } catch (error) {
      toast.error("Failed to generate market analysis");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePositioning = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate positioning strategy
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPositioningStrategy({
        valueProposition:
          "AI-powered GTM platform that accelerates revenue growth through intelligent automation and insights",
        targetAudience:
          "B2B SaaS companies with 50-500 employees, focusing on sales and marketing teams",
        keyDifferentiators: [
          "Advanced AI capabilities",
          "Comprehensive analytics",
          "Seamless integration",
          "Customizable workflows",
        ],
        messaging:
          "Transform your go-to-market strategy with AI-powered insights and automation",
      });
      toast.success("Positioning strategy created successfully!");
    } catch (error) {
      toast.error("Failed to create positioning strategy");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanChannels = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate channel strategy
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setChannelStrategy({
        channels: [
          {
            name: "Content Marketing",
            priority: "High",
            budget: "$50,000",
            metrics: [
              "Website traffic",
              "Lead generation",
              "Content engagement",
            ],
          },
          {
            name: "Paid Advertising",
            priority: "High",
            budget: "$30,000",
            metrics: ["Click-through rate", "Cost per lead", "Conversion rate"],
          },
          {
            name: "Email Marketing",
            priority: "Medium",
            budget: "$15,000",
            metrics: ["Open rate", "Click rate", "Unsubscribe rate"],
          },
          {
            name: "Social Media",
            priority: "Medium",
            budget: "$20,000",
            metrics: ["Engagement rate", "Follower growth", "Social shares"],
          },
        ],
      });
      toast.success("Channel strategy planned successfully!");
    } catch (error) {
      toast.error("Failed to plan channel strategy");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = (template: GTMStrategyTemplate) => {
    setActiveStrategy({
      ...activeStrategy,
      items: template.items,
      status: "Draft",
      updatedAt: new Date().toISOString(),
    });
    toast.success(`Applied ${template.name} template successfully!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            GTM Strategy
          </h2>
          <p className="text-slate-500 mt-1">
            Plan, develop, and execute your go-to-market strategy with AI
            assistance
          </p>
        </div>
        <Button className="btn-gradient">
          <Plus className="mr-2 h-4 w-4" />
          New Strategy
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="positioning">Positioning</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strategy Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>
                        {activeStrategy.items.reduce(
                          (acc, item) => acc + item.progress,
                          0
                        ) / activeStrategy.items.length}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        activeStrategy.items.reduce(
                          (acc, item) => acc + item.progress,
                          0
                        ) / activeStrategy.items.length
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    {activeStrategy.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{item.title}</span>
                        <span className="text-sm font-medium">
                          {item.progress}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleStartAnalysis}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Start Market Analysis
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCreatePositioning}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Positioning
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePlanChannels}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Plan Channels
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strategy Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeStrategy.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : activeStrategy.status === "Draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {activeStrategy.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Created</span>
                    <span className="text-sm">
                      {new Date(activeStrategy.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm">
                      {new Date(activeStrategy.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Market Analysis</CardTitle>
                <Button
                  variant="outline"
                  onClick={handleStartAnalysis}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Analysis"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Provide Context for Analysis</Label>
                  <Textarea
                    placeholder="Describe your industry, target market, product/service, and any specific areas you want the analysis to focus on..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    The more context you provide, the more accurate and relevant
                    the analysis will be.
                  </p>
                </div>

                {marketAnalysis ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Market Size</Label>
                        <Input value={marketAnalysis.marketSize} readOnly />
                      </div>
                      <div>
                        <Label>Growth Rate</Label>
                        <Input value={marketAnalysis.growthRate} readOnly />
                      </div>
                      <div>
                        <Label>Total Addressable Market (TAM)</Label>
                        <Input
                          value={marketAnalysis.totalAddressableMarket}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Key Trends</Label>
                      <div className="space-y-2 mt-2">
                        {marketAnalysis.keyTrends.map((trend, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                            {trend}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Competitors</Label>
                      <div className="space-y-2 mt-2">
                        {marketAnalysis.competitors.map((competitor, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <ChevronRight className="h-4 w-4 text-red-500" />
                            {competitor}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Opportunities</Label>
                      <div className="space-y-2 mt-2">
                        {marketAnalysis.opportunities.map(
                          (opportunity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <ChevronRight className="h-4 w-4 text-green-500" />
                              {opportunity}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Ideal Customer Profile (ICP)</Label>
                      <div className="space-y-4 mt-2 p-4 bg-slate-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium">Industry:</span>
                          <p className="text-sm mt-1">
                            {marketAnalysis.idealCustomerProfile.industry}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            Company Size:
                          </span>
                          <p className="text-sm mt-1">
                            {marketAnalysis.idealCustomerProfile.companySize}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            Pain Points:
                          </span>
                          <div className="space-y-1 mt-1">
                            {marketAnalysis.idealCustomerProfile.painPoints.map(
                              (point, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <ChevronRight className="h-4 w-4 text-blue-500" />
                                  {point}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            Decision Makers:
                          </span>
                          <div className="space-y-1 mt-1">
                            {marketAnalysis.idealCustomerProfile.decisionMakers.map(
                              (role, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <ChevronRight className="h-4 w-4 text-blue-500" />
                                  {role}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Budget:</span>
                          <p className="text-sm mt-1">
                            {marketAnalysis.idealCustomerProfile.budget}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Market Analysis Yet
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Provide context about your business and generate a
                      comprehensive market analysis using AI.
                    </p>
                    <Button
                      onClick={handleStartAnalysis}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate Analysis"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positioning" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Positioning Strategy</CardTitle>
                <Button
                  variant="outline"
                  onClick={handleCreatePositioning}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Positioning"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {positioningStrategy ? (
                <div className="space-y-6">
                  <div>
                    <Label>Value Proposition</Label>
                    <Textarea
                      value={positioningStrategy.valueProposition}
                      readOnly
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Target Audience</Label>
                    <Input
                      value={positioningStrategy.targetAudience}
                      readOnly
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Key Differentiators</Label>
                    <div className="space-y-2 mt-2">
                      {positioningStrategy.keyDifferentiators.map(
                        (differentiator, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <ChevronRight className="h-4 w-4 text-blue-500" />
                            {differentiator}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Messaging</Label>
                    <Textarea
                      value={positioningStrategy.messaging}
                      readOnly
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Positioning Strategy Yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Generate a compelling positioning strategy using AI to
                    differentiate your product in the market.
                  </p>
                  <Button
                    onClick={handleCreatePositioning}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Positioning"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Channel Strategy</CardTitle>
                <Button
                  variant="outline"
                  onClick={handlePlanChannels}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Channel Plan"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {channelStrategy ? (
                <div className="space-y-6">
                  {channelStrategy.channels.map((channel, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{channel.name}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-slate-500">
                                Budget: {channel.budget}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  channel.priority === "High"
                                    ? "bg-red-100 text-red-600"
                                    : channel.priority === "Medium"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {channel.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Key Metrics</Label>
                          <div className="space-y-2 mt-2">
                            {channel.metrics.map((metric, metricIndex) => (
                              <div
                                key={metricIndex}
                                className="flex items-center gap-2 text-sm"
                              >
                                <ChevronRight className="h-4 w-4 text-blue-500" />
                                {metric}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Channel Strategy Yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Generate an optimized channel strategy using AI to maximize
                    your go-to-market impact.
                  </p>
                  <Button onClick={handlePlanChannels} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Channel Plan"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:border-blue-300 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{template.description}</p>
                  <div className="space-y-2 mb-4">
                    {template.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <ChevronRight className="h-4 w-4 text-blue-500" />
                        {item.title}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    Apply Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GTMStrategyPage;
