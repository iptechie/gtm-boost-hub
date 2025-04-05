import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Circle,
  Bell,
  Briefcase,
  AlertCircle,
  Settings,
  Target,
  XCircle,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lead, JobChange } from "@/types/lead";
import { linkedinService } from "@/services/linkedinService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface LeadScoringConfig {
  engagementWeight: number;
  companySizeWeight: number;
  industryWeight: number;
  budgetWeight: number;
  timelineWeight: number;
}

interface LeadScore {
  leadId: string;
  score: number;
  factors: string[];
}

interface NextBestAction {
  leadId: string;
  action: string;
  priority: "high" | "medium" | "low";
}

interface MarketTrend {
  category: string;
  trend: string;
  impact: "positive" | "negative" | "neutral";
}

interface AIInsightsPageProps {
  onLeadUpdate?: (updatedLead: Lead) => void;
}

const AIInsightsPage: React.FC<AIInsightsPageProps> = ({ onLeadUpdate }) => {
  const [pageLeads, setPageLeads] = useState<Lead[]>([]);
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);
  const [errorLoadingPageData, setErrorLoadingPageData] = useState<
    string | null
  >(null);
  const [jobChanges, setJobChanges] = useState<JobChange[]>([]);
  const [isLoadingJobChanges, setIsLoadingJobChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("lead-scoring");
  const [hasValidApiKey, setHasValidApiKey] = useState(true);
  const [leadScoringConfig, setLeadScoringConfig] = useState<LeadScoringConfig>(
    {
      engagementWeight: 30,
      companySizeWeight: 20,
      industryWeight: 20,
      budgetWeight: 15,
      timelineWeight: 15,
    }
  );
  const [showScoringConfig, setShowScoringConfig] = useState(false);

  const { organization } = useAuth();
  const subscriptionTier = organization?.subscriptionTier;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPageData(true);
      setIsLoadingJobChanges(true);
      setErrorLoadingPageData(null);
      try {
        const response = await fetch("/api/ai-insights");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const fetchedLeads = Array.isArray(data?.leads) ? data.leads : [];
        setPageLeads(fetchedLeads);

        if (Array.isArray(data?.jobChanges)) {
          setJobChanges(data.jobChanges);
        }

        linkedinService.setLeads(fetchedLeads);
      } catch (error) {
        console.error("Error fetching AI Insights data:", error);
        setErrorLoadingPageData("Failed to load AI Insights data.");
        toast.error("Failed to load AI Insights data.");
      } finally {
        setIsLoadingPageData(false);
        setIsLoadingJobChanges(false);
      }
    };

    fetchData();
  }, [hasValidApiKey, subscriptionTier]);

  const calculateLeadScore = (lead: Lead): number => {
    let score = 0;

    if (lead.engagement) {
      score += (lead.engagement / 100) * leadScoringConfig.engagementWeight;
    }

    if (lead.companySize) {
      const sizeScore = Math.min(lead.companySize / 1000, 1);
      score += sizeScore * leadScoringConfig.companySizeWeight;
    }

    if (lead.industry) {
      score += leadScoringConfig.industryWeight;
    }

    if (lead.budget) {
      const budgetScore = Math.min(lead.budget / 100000, 1);
      score += budgetScore * leadScoringConfig.budgetWeight;
    }

    if (lead.timeline) {
      const timelineScore =
        lead.timeline === "Immediate"
          ? 1
          : lead.timeline === "1-3 months"
          ? 0.8
          : lead.timeline === "3-6 months"
          ? 0.6
          : 0.4;
      score += timelineScore * leadScoringConfig.timelineWeight;
    }

    return Math.round(score);
  };

  const sortedLeads = [...pageLeads].sort((a, b) => {
    const scoreA = calculateLeadScore(a);
    const scoreB = calculateLeadScore(b);
    return scoreB - scoreA;
  });

  const highPotentialLeads = sortedLeads.filter(
    (lead) => calculateLeadScore(lead) >= 80
  );
  const mediumPotentialLeads = sortedLeads.filter(
    (lead) => calculateLeadScore(lead) >= 50 && calculateLeadScore(lead) < 80
  );
  const lowPotentialLeads = sortedLeads.filter(
    (lead) => calculateLeadScore(lead) < 50
  );

  const handleVerifyJobChange = async (jobChange: JobChange) => {
    try {
      const result = await linkedinService.verifyJobChange(jobChange);

      if (result.success && result.updatedLead) {
        setJobChanges((prev) =>
          prev.map((change) =>
            change.id === jobChange.id
              ? { ...change, status: "Verified" as const }
              : change
          )
        );

        if (onLeadUpdate) {
          onLeadUpdate(result.updatedLead);
        }

        toast.success("Job change verified and lead information updated!");
      } else {
        toast.error("Failed to verify job change");
      }
    } catch (error) {
      console.error("Error verifying job change:", error);
      toast.error("An error occurred while verifying the job change");
    }
  };

  const handleMarkFalsePositive = async (jobChange: JobChange) => {
    try {
      const success = await linkedinService.markAsFalsePositive(jobChange);
      if (success) {
        setJobChanges((prev) =>
          prev.map((change) =>
            change.id === jobChange.id
              ? { ...change, status: "False Positive" as const }
              : change
          )
        );
        toast.info("Marked as false positive");
      } else {
        toast.error("Failed to mark as false positive");
      }
    } catch (error) {
      console.error("Error marking job change as false positive:", error);
      toast.error("An error occurred while marking as false positive");
    }
  };

  const renderJobChanges = () => {
    if (isLoadingJobChanges) {
      return <div>Loading job changes...</div>;
    }

    if (errorLoadingPageData) {
      return <div className="text-red-500">{errorLoadingPageData}</div>;
    }

    if (jobChanges.length === 0) {
      return <div>No pending job changes found.</div>;
    }

    return (
      <div className="grid gap-4">
        {jobChanges.map((change) => (
          <Card key={change.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{change.previousCompany}</span>
                  <span>→</span>
                  <span className="font-medium">{change.newCompany}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{change.previousTitle}</span>
                  <span>→</span>
                  <span>{change.newTitle}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Detected on {new Date(change.changeDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerifyJobChange(change)}
                  disabled={change.status !== "Pending"}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Verify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkFalsePositive(change)}
                  disabled={change.status !== "Pending"}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  False Positive
                </Button>
              </div>
            </div>
            <Badge
              variant={
                change.status === "Verified"
                  ? "default"
                  : change.status === "False Positive"
                  ? "destructive"
                  : "secondary"
              }
              className="mt-2"
            >
              {change.status}
            </Badge>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">AI Insights</h1>
      <Tabs
        defaultValue="job-changes"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="job-changes">Job Changes</TabsTrigger>
          <TabsTrigger value="lead-scores">Lead Scores</TabsTrigger>
          <TabsTrigger value="next-actions">Next Actions</TabsTrigger>
          <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="job-changes">
          <h2 className="text-xl font-semibold mb-4">Recent Job Changes</h2>
          {renderJobChanges()}
        </TabsContent>
        <TabsContent value="lead-scores">
          <h2 className="text-xl font-semibold mb-4">Lead Scoring</h2>
          {isLoadingPageData ? (
            <div>Loading lead scores...</div>
          ) : errorLoadingPageData ? (
            <div className="text-red-500">{errorLoadingPageData}</div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Lead Scoring Configuration
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScoringConfig(!showScoringConfig)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showScoringConfig ? "Hide Config" : "Configure"}
                </Button>
              </div>

              {showScoringConfig && (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="engagementWeight">
                        Engagement Weight
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="engagementWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={leadScoringConfig.engagementWeight}
                          onChange={(e) =>
                            setLeadScoringConfig({
                              ...leadScoringConfig,
                              engagementWeight: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                        <Progress
                          value={leadScoringConfig.engagementWeight}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="companySizeWeight">
                        Company Size Weight
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="companySizeWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={leadScoringConfig.companySizeWeight}
                          onChange={(e) =>
                            setLeadScoringConfig({
                              ...leadScoringConfig,
                              companySizeWeight: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                        <Progress
                          value={leadScoringConfig.companySizeWeight}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="industryWeight">Industry Weight</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="industryWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={leadScoringConfig.industryWeight}
                          onChange={(e) =>
                            setLeadScoringConfig({
                              ...leadScoringConfig,
                              industryWeight: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                        <Progress
                          value={leadScoringConfig.industryWeight}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="budgetWeight">Budget Weight</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="budgetWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={leadScoringConfig.budgetWeight}
                          onChange={(e) =>
                            setLeadScoringConfig({
                              ...leadScoringConfig,
                              budgetWeight: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                        <Progress
                          value={leadScoringConfig.budgetWeight}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timelineWeight">Timeline Weight</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="timelineWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={leadScoringConfig.timelineWeight}
                          onChange={(e) =>
                            setLeadScoringConfig({
                              ...leadScoringConfig,
                              timelineWeight: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                        <Progress
                          value={leadScoringConfig.timelineWeight}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">High Potential</h4>
                    <Badge variant="default">{highPotentialLeads.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {highPotentialLeads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-2 bg-secondary/20 rounded-md"
                      >
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {lead.company}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-bold">
                            {calculateLeadScore(lead)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {highPotentialLeads.length > 3 && (
                      <div className="text-sm text-center text-muted-foreground">
                        +{highPotentialLeads.length - 3} more leads
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Medium Potential</h4>
                    <Badge variant="secondary">
                      {mediumPotentialLeads.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {mediumPotentialLeads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-2 bg-secondary/10 rounded-md"
                      >
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {lead.company}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="font-bold">
                            {calculateLeadScore(lead)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {mediumPotentialLeads.length > 3 && (
                      <div className="text-sm text-center text-muted-foreground">
                        +{mediumPotentialLeads.length - 3} more leads
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Low Potential</h4>
                    <Badge variant="outline">{lowPotentialLeads.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {lowPotentialLeads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-2 bg-secondary/5 rounded-md"
                      >
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {lead.company}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Circle className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="font-bold">
                            {calculateLeadScore(lead)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {lowPotentialLeads.length > 3 && (
                      <div className="text-sm text-center text-muted-foreground">
                        +{lowPotentialLeads.length - 3} more leads
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const minScore = i * 10;
                      const maxScore = minScore + 9;
                      const leadsInRange = sortedLeads.filter((lead) => {
                        const score = calculateLeadScore(lead);
                        return score >= minScore && score <= maxScore;
                      }).length;

                      const maxLeads = Math.max(
                        ...Array.from({ length: 10 }).map((_, j) => {
                          const rangeMin = j * 10;
                          const rangeMax = rangeMin + 9;
                          return sortedLeads.filter((lead) => {
                            const score = calculateLeadScore(lead);
                            return score >= rangeMin && score <= rangeMax;
                          }).length;
                        })
                      );

                      const height =
                        maxLeads > 0 ? (leadsInRange / maxLeads) * 100 : 0;

                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className={`w-8 rounded-t-md ${
                              minScore >= 80
                                ? "bg-green-500"
                                : minScore >= 50
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                          <div className="text-xs mt-1">
                            {minScore}-{maxScore}
                          </div>
                          <div className="text-xs font-medium">
                            {leadsInRange}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        <TabsContent value="next-actions">
          <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
          {isLoadingPageData ? (
            <div>Loading recommended actions...</div>
          ) : errorLoadingPageData ? (
            <div className="text-red-500">{errorLoadingPageData}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">High Priority</h3>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                  <div className="space-y-3">
                    {highPotentialLeads.slice(0, 3).map((lead) => (
                      <Card
                        key={lead.id}
                        className="p-3 border-l-4 border-l-red-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {lead.company}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-bold">
                              {calculateLeadScore(lead)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>Schedule a demo call</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>Send personalized proposal</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-2">
                          Take Action
                        </Button>
                      </Card>
                    ))}
                    {highPotentialLeads.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        No high priority actions at this time
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Medium Priority</h3>
                    <Badge variant="secondary">Important</Badge>
                  </div>
                  <div className="space-y-3">
                    {mediumPotentialLeads.slice(0, 3).map((lead) => (
                      <Card
                        key={lead.id}
                        className="p-3 border-l-4 border-l-blue-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {lead.company}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Target className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="font-bold">
                              {calculateLeadScore(lead)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>Follow up with case studies</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>Share relevant content</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                        >
                          Take Action
                        </Button>
                      </Card>
                    ))}
                    {mediumPotentialLeads.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        No medium priority actions at this time
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Low Priority</h3>
                    <Badge variant="outline">When Available</Badge>
                  </div>
                  <div className="space-y-3">
                    {lowPotentialLeads.slice(0, 3).map((lead) => (
                      <Card
                        key={lead.id}
                        className="p-3 border-l-4 border-l-gray-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {lead.company}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Circle className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-bold">
                              {calculateLeadScore(lead)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>Add to nurture sequence</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>Monitor for changes</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-2"
                        >
                          Take Action
                        </Button>
                      </Card>
                    ))}
                    {lowPotentialLeads.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        No low priority actions at this time
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Action Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...highPotentialLeads, ...mediumPotentialLeads]
                      .slice(0, 5)
                      .map((lead, index) => (
                        <div key={lead.id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-red-500"
                                  : index < 3
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            {index < 4 && (
                              <div className="w-0.5 h-16 bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {lead.company}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {index === 0
                                  ? "Today"
                                  : index === 1
                                  ? "Tomorrow"
                                  : index === 2
                                  ? "In 2 days"
                                  : index === 3
                                  ? "In 3 days"
                                  : "In 1 week"}
                              </div>
                            </div>
                            <div className="mt-2 text-sm">
                              {index === 0
                                ? "Schedule a demo call"
                                : index === 1
                                ? "Send personalized proposal"
                                : index === 2
                                ? "Follow up with case studies"
                                : index === 3
                                ? "Share relevant content"
                                : "Add to nurture sequence"}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        <TabsContent value="market-trends">
          <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
          {isLoadingPageData ? (
            <div>Loading market trends...</div>
          ) : errorLoadingPageData ? (
            <div className="text-red-500">{errorLoadingPageData}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>AI & Machine Learning</span>
                        </div>
                        <Badge variant="default">+24%</Badge>
                      </div>
                      <Progress value={24} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Cloud Computing</span>
                        </div>
                        <Badge variant="default">+18%</Badge>
                      </div>
                      <Progress value={18} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Cybersecurity</span>
                        </div>
                        <Badge variant="default">+15%</Badge>
                      </div>
                      <Progress value={15} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Remote Work Solutions</span>
                        </div>
                        <Badge variant="default">+12%</Badge>
                      </div>
                      <Progress value={12} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Data Analytics</span>
                        </div>
                        <Badge variant="default">+10%</Badge>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Competitor Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>Competitor A launched new feature</span>
                        </div>
                        <Badge variant="secondary">2 days ago</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Competitor A has launched a new AI-powered feature that
                        could impact our market position.
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>Competitor B pricing change</span>
                        </div>
                        <Badge variant="secondary">1 week ago</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Competitor B has reduced their pricing by 15%, which may
                        affect our competitive advantage.
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>Competitor C partnership</span>
                        </div>
                        <Badge variant="secondary">2 weeks ago</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Competitor C has announced a strategic partnership with
                        a major industry player.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Market Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Emerging Market Segment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          There's a growing demand for AI-powered solutions in
                          the healthcare industry. Consider developing a
                          specialized product for this segment.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Healthcare</Badge>
                          <Badge variant="outline">AI</Badge>
                          <Badge variant="outline">High Growth</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Product Enhancement</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Customers are requesting integration with popular
                          third-party platforms. Adding these integrations could
                          significantly increase market share.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Integration</Badge>
                          <Badge variant="outline">Feature Request</Badge>
                          <Badge variant="outline">Medium Effort</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Pricing Strategy</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Analysis shows that a tiered pricing model could
                          increase revenue by 25% while maintaining competitive
                          positioning.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Pricing</Badge>
                          <Badge variant="outline">Revenue</Badge>
                          <Badge variant="outline">Low Effort</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsightsPage;
