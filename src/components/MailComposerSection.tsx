import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import {
  Upload,
  Wand2,
  Copy,
  Save,
  Loader2,
  Languages,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface MailComposerSectionProps {
  onSave: (emailData: {
    name: string;
    type: string;
    description: string;
    content: string;
  }) => void;
}

const TONE_OPTIONS = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "urgent", label: "Urgent" },
  { value: "professional", label: "Professional" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "nl", label: "Dutch" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "ar", label: "Arabic" },
];

export const MailComposerSection: React.FC<MailComposerSectionProps> = ({
  onSave,
}) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordLimit, setWordLimit] = useState([200]);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [existingEmail, setExistingEmail] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      toast.success("File uploaded successfully");
    }
  };

  const handleGenerate = async () => {
    if (!topic && !selectedFile && !existingEmail) {
      toast.error("Please provide a topic or upload a file");
      return;
    }

    setIsGenerating(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockGeneratedEmail = `Dear [Name],

I hope this email finds you well. I am writing to discuss ${topic}.

[Generated content based on the topic with ${wordLimit[0]} words in ${tone} tone]

Best regards,
[Your name]`;

    setGeneratedEmail(mockGeneratedEmail);
    setIsGenerating(false);
    toast.success("Email generated successfully");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success("Copied to clipboard");
  };

  const handleSaveToPlanner = () => {
    if (!generatedEmail) {
      toast.error("Please generate an email first");
      return;
    }

    onSave({
      name: topic || "New Email Campaign",
      type: "Email Campaign",
      description: `Generated email with ${tone} tone`,
      content: generatedEmail,
    });

    toast.success("Saved to planner successfully");
    // Reset form
    setTopic("");
    setGeneratedEmail("");
    setSelectedFile(null);
    setExistingEmail("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Composer</CardTitle>
          <CardDescription>
            Generate AI-powered emails with custom parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or Context</Label>
            <Textarea
              id="topic"
              placeholder="Enter your email topic or context..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload File (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-slate-50"
              >
                <Upload className="w-4 h-4" />
                {selectedFile ? selectedFile.name : "Choose file"}
              </Label>
              {selectedFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Supported formats: PDF, DOC, DOCX, TXT (max 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Word Limit</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={wordLimit}
                onValueChange={setWordLimit}
                max={300}
                min={50}
                step={10}
                className="flex-1"
              />
              <span className="text-sm font-medium w-16">
                {wordLimit[0]} words
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Email (Optional)</Label>
            <Textarea
              placeholder="Paste existing email for translation..."
              value={existingEmail}
              onChange={(e) => setExistingEmail(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Email</CardTitle>
          <CardDescription>
            Preview and manage your generated email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {generatedEmail ? (
            <>
              <Textarea
                value={generatedEmail}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex items-center gap-4">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button className="flex-1" onClick={handleSaveToPlanner}>
                  <Save className="w-4 h-4 mr-2" />
                  Save to Planner
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
              <FileText className="w-12 h-12 mb-4" />
              <p className="text-center">
                Generated email will appear here.
                <br />
                Configure your parameters and click Generate.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
