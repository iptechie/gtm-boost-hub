import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  emailIntegrationService,
  EmailMessage,
} from "@/services/emailIntegrationService";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeatureGate } from "@/components/FeatureGate";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  Mail,
  Star,
  StarOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  MessageSquare,
  FileText,
  Link,
  TrendingUp,
} from "lucide-react";

interface LeadEmailsProps {
  leadId: string;
}

const LeadEmails: React.FC<LeadEmailsProps> = ({ leadId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [suggestedTemplates, setSuggestedTemplates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [analysisResults, setAnalysisResults] = useState<{
    sentiment: "positive" | "negative" | "neutral";
    intent: "interested" | "not_interested" | "needs_more_info" | "unknown";
    suggestedScore: number;
  } | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const fetchedEmails = await emailIntegrationService.getEmails({
          leadId,
          limit: 50,
        });
        setEmails(fetchedEmails);

        // If we have emails and none is selected, select the first one
        if (fetchedEmails.length > 0 && !selectedEmail) {
          setSelectedEmail(fetchedEmails[0]);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
        toast.error("Failed to fetch emails");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, [leadId]);

  useEffect(() => {
    const analyzeSelectedEmail = async () => {
      if (selectedEmail) {
        try {
          const analysis = await emailIntegrationService.analyzeEmail(
            selectedEmail
          );
          setAnalysisResults(analysis);

          // Update lead score based on the email
          await emailIntegrationService.updateLeadScore(leadId, selectedEmail);
        } catch (error) {
          console.error("Error analyzing email:", error);
          toast.error("Failed to analyze email");
        }
      }
    };

    analyzeSelectedEmail();
  }, [selectedEmail, leadId]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (selectedEmail) {
        try {
          const templates = await emailIntegrationService.getSuggestedTemplates(
            selectedEmail.id
          );
          setSuggestedTemplates(templates);
        } catch (error) {
          console.error("Error fetching templates:", error);
        }
      }
    };

    fetchTemplates();
  }, [selectedEmail]);

  const handleEmailSelect = (email: EmailMessage) => {
    setSelectedEmail(email);

    // Mark as read if not already read
    if (!email.read) {
      emailIntegrationService
        .markEmailAsRead(email.id)
        .then(() => {
          setEmails(
            emails.map((e) => (e.id === email.id ? { ...e, read: true } : e))
          );
        })
        .catch((error) => {
          console.error("Error marking email as read:", error);
        });
    }
  };

  const handleToggleStarred = async (emailId: string) => {
    try {
      await emailIntegrationService.toggleStarred(emailId);
      setEmails(
        emails.map((e) =>
          e.id === emailId ? { ...e, starred: !e.starred } : e
        )
      );

      // Update selected email if it's the one being toggled
      if (selectedEmail && selectedEmail.id === emailId) {
        setSelectedEmail({
          ...selectedEmail,
          starred: !selectedEmail.starred,
        });
      }
    } catch (error) {
      console.error("Error toggling starred:", error);
      toast.error("Failed to update email");
    }
  };

  const handleSyncEmails = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would sync emails from all connected providers
      // For now, we'll just simulate a sync
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Refresh the emails
      const fetchedEmails = await emailIntegrationService.getEmails({
        leadId,
        limit: 50,
      });
      setEmails(fetchedEmails);

      toast.success("Emails synced successfully");
    } catch (error) {
      console.error("Error syncing emails:", error);
      toast.error("Failed to sync emails");
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case "neutral":
        return <HelpCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case "interested":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "not_interested":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "needs_more_info":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getIntentLabel = (intent?: string) => {
    switch (intent) {
      case "interested":
        return "Interested";
      case "not_interested":
        return "Not Interested";
      case "needs_more_info":
        return "Needs More Info";
      default:
        return "Unknown Intent";
    }
  };

  const filteredEmails = emails.filter((email) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !email.read;
    if (activeTab === "starred") return email.starred;
    return true;
  });

  return (
    <FeatureGate
      integrationFeature="email"
      fallback={
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Feature not available</AlertTitle>
          <AlertDescription>
            Email integration is only available on higher subscription tiers.
            Please upgrade your plan to access this feature.
          </AlertDescription>
        </Alert>
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lead Emails</CardTitle>
            <CardDescription>
              View and analyze emails from this lead
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncEmails}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Emails
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Emails</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <ScrollArea className="h-[600px]">
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {emails.map((email) => (
                          <div
                            key={email.id}
                            className={`p-4 rounded-lg cursor-pointer ${
                              selectedEmail?.id === email.id
                                ? "bg-primary/10"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => handleEmailSelect(email)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{email.subject}</p>
                                <p className="text-sm text-muted-foreground">
                                  {email.from}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {email.starred ? (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    email.receivedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <div className="col-span-2">
                  {selectedEmail ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">
                            {selectedEmail.subject}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            From: {selectedEmail.from}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStarred(selectedEmail.id)}
                        >
                          {selectedEmail.starred ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <Separator />

                      {analysisResults && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Email Analysis
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Sentiment
                                </p>
                                <Badge
                                  variant={
                                    analysisResults.sentiment === "positive"
                                      ? "default"
                                      : analysisResults.sentiment === "negative"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {analysisResults.sentiment}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Intent
                                </p>
                                <Badge variant="outline">
                                  {analysisResults.intent.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">
                                Suggested Score Change
                              </p>
                              <Badge variant="outline">
                                +{analysisResults.suggestedScore}
                              </Badge>
                            </div>
                            <Progress
                              value={analysisResults.suggestedScore}
                              className="h-2"
                            />
                          </div>
                        </div>
                      )}

                      <div className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              selectedEmail.bodyHtml || selectedEmail.body,
                          }}
                        />
                      </div>

                      {selectedEmail.attachments &&
                        selectedEmail.attachments.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Attachments
                            </h4>
                            <div className="space-y-2">
                              {selectedEmail.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center justify-between p-2 rounded-lg border"
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">
                                      {attachment.name}
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      window.open(attachment.url, "_blank")
                                    }
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        Select an email to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </FeatureGate>
  );
};

export default LeadEmails;
