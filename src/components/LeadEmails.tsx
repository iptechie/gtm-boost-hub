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
      feature="email"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email List */}
            <div className="md:col-span-1 border rounded-md">
              <div className="p-2 border-b">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ScrollArea className="h-[500px]">
                {isLoading ? (
                  <div className="p-4 space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No emails found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-3 cursor-pointer hover:bg-muted ${
                          selectedEmail?.id === email.id ? "bg-muted" : ""
                        } ${!email.read ? "font-medium" : ""}`}
                        onClick={() => handleEmailSelect(email)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              {!email.read && (
                                <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                              )}
                              <p className="truncate">{email.subject}</p>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {email.from}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {email.starred && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(email.receivedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Email Content */}
            <div className="md:col-span-2 border rounded-md">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Separator />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : selectedEmail ? (
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>From: {selectedEmail.from}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(selectedEmail.receivedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStarred(selectedEmail.id)}
                    >
                      {selectedEmail.starred ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="flex items-center">
                        {getSentimentIcon(selectedEmail.sentiment)}
                        <span className="ml-1">
                          {selectedEmail.sentiment
                            ? selectedEmail.sentiment.charAt(0).toUpperCase() +
                              selectedEmail.sentiment.slice(1)
                            : "Unknown"}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        {getIntentIcon(selectedEmail.intent)}
                        <span className="ml-1">
                          {getIntentLabel(selectedEmail.intent)}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-6">
                    {selectedEmail.bodyHtml ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedEmail.bodyHtml,
                        }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">
                        {selectedEmail.body}
                      </p>
                    )}
                  </div>

                  {selectedEmail.attachments &&
                    selectedEmail.attachments.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">
                          Attachments
                        </h4>
                        <div className="space-y-2">
                          {selectedEmail.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center justify-between p-2 border rounded-md"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-sm">
                                  {attachment.name}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Link className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {suggestedTemplates.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Suggested Responses
                      </h4>
                      <div className="space-y-2">
                        {suggestedTemplates.map((template, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-md bg-muted/50"
                          >
                            <p className="text-sm">{template}</p>
                            <div className="flex justify-end mt-2">
                              <Button variant="outline" size="sm">
                                Use Template
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select an email to view</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </FeatureGate>
  );
};

export default LeadEmails;
