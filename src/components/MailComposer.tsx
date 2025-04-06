import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Copy, Upload, RotateCw } from "lucide-react";
import { toast } from "sonner";

type EmailTone =
  | "Formal"
  | "Friendly"
  | "Persuasive"
  | "Urgent"
  | "Professional";

interface MailComposerProps {
  onSaveToPlanner?: (emailContent: {
    subject: string;
    content: string;
    tone: EmailTone;
  }) => void;
}

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Japanese",
  "Korean",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Arabic",
  "Turkish",
  "Vietnamese",
  "Thai",
  "Indonesian",
  "Malay",
  "Filipino",
  "Greek",
  "Polish",
  "Czech",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Romanian",
  "Hungarian",
  "Slovak",
  "Croatian",
];

export const MailComposer: React.FC<MailComposerProps> = ({
  onSaveToPlanner,
}) => {
  const [topic, setTopic] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [wordLimit, setWordLimit] = useState([150]);
  const [tone, setTone] = useState<EmailTone>("Professional");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [existingEmail, setExistingEmail] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setUploadedFile(file);
      toast.success("File uploaded successfully");
    }
  };

  const handleGenerate = async () => {
    if (!topic && !uploadedFile && !existingEmail) {
      toast.error("Please provide either a topic, file, or existing email");
      return;
    }

    setIsGenerating(true);
    try {
      // TODO: Replace with actual API call to Gemma model
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      const mockGeneratedEmail = `Dear [Name],

I hope this email finds you well. This is a sample generated email based on your parameters:
- Topic: ${topic}
- Tone: ${tone}
- Word Limit: ${wordLimit[0]}

[Generated content will appear here]

Best regards,
[Your name]`;

      setGeneratedEmail(mockGeneratedEmail);
      toast.success("Email generated successfully");
    } catch (error) {
      toast.error("Failed to generate email");
    } finally {
      setIsGenerating(false);
    }
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

    onSaveToPlanner?.({
      subject: topic,
      content: generatedEmail,
      tone,
    });
    toast.success("Saved to planner");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Email Topic or Content Request</Label>
            <Textarea
              placeholder="Be specific about what you want in your email.&#10;Example: 'Birthday party invitation for this Saturday at 7PM at my house' or 'Job application follow-up after interview yesterday'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-24"
            />
          </div>

          <div>
            <Label>Upload File (Optional)</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT (max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {uploadedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Uploaded: {uploadedFile.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Word Limit: {wordLimit[0]}</Label>
            <Slider
              value={wordLimit}
              onValueChange={setWordLimit}
              min={50}
              max={300}
              step={10}
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Email Tone</Label>
              <Select
                value={tone}
                onValueChange={(value) => setTone(value as EmailTone)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Target Language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Existing Email for Translation (Optional)</Label>
            <Textarea
              placeholder="Paste an existing email here for translation..."
              value={existingEmail}
              onChange={(e) => setExistingEmail(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Email"
              )}
            </Button>
            {onSaveToPlanner && (
              <Button
                onClick={handleSaveToPlanner}
                disabled={!generatedEmail}
                variant="outline"
              >
                Save to Planner
              </Button>
            )}
          </div>
        </div>
      </Card>

      {generatedEmail && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Email</h3>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
            {generatedEmail}
          </div>
        </Card>
      )}
    </div>
  );
};
