import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type {
  LeadConfiguration as LeadConfigType,
  LeadStatus,
  LeadCategory,
  LeadIndustry,
  LeadSource,
  LeadTimeline,
} from "@/types/lead";
import { toast } from "sonner";

interface LeadConfigurationProps {
  configuration: LeadConfigType;
  onSave: (config: LeadConfigType) => void;
}

const defaultLeadStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Discovery Meeting",
  "Demo Meeting",
  "RFP",
  "Proposal",
  "Closed Won",
  "Closed Lost",
];

export const LeadConfiguration: React.FC<LeadConfigurationProps> = ({
  configuration,
  onSave,
}) => {
  const [newStatus, setNewStatus] = useState<LeadStatus>("");
  const [newCategory, setNewCategory] = useState<LeadCategory>("");
  const [newIndustry, setNewIndustry] = useState<LeadIndustry>("");
  const [newSource, setNewSource] = useState<LeadSource>("");
  const [newTimeline, setNewTimeline] = useState<LeadTimeline>("");

  const [config, setConfig] = useState<LeadConfigType>(configuration);

  const handleAddItem = (
    type: keyof LeadConfigType,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!value.trim()) return;

    if (config[type].includes(value.trim())) {
      toast.error(`${value} already exists in ${type}`);
      return;
    }

    setConfig((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
    setValue("");
  };

  const handleRemoveItem = (type: keyof LeadConfigType, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  const handleSave = () => {
    onSave(config);
    toast.success("Lead configuration saved successfully");
  };

  const handleResetStatuses = () => {
    setConfig((prev) => ({
      ...prev,
      statuses: defaultLeadStatuses,
    }));
  };

  const renderSection = (
    title: string,
    type: keyof LeadConfigType,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor={type}>{title}</Label>
          <div className="flex gap-2">
            <Input
              id={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem(type, value, setValue);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => handleAddItem(type, value, setValue)}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {config[type].map((item) => (
          <Badge key={item} variant="secondary" className="text-sm">
            {item}
            <button
              onClick={() => handleRemoveItem(type, item)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead Configuration</CardTitle>
          <CardDescription>
            Configure the options available for lead management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSection(
            "Lead Statuses",
            "statuses",
            newStatus,
            setNewStatus,
            "Enter a new lead status"
          )}
          {renderSection(
            "Lead Categories",
            "categories",
            newCategory,
            setNewCategory,
            "Enter a new lead category"
          )}
          {renderSection(
            "Industries",
            "industries",
            newIndustry,
            setNewIndustry,
            "Enter a new industry"
          )}
          {renderSection(
            "Lead Sources",
            "sources",
            newSource,
            setNewSource,
            "Enter a new lead source"
          )}
          {renderSection(
            "Follow-up Timelines",
            "timelines",
            newTimeline,
            setNewTimeline,
            "Enter a new timeline (e.g., '1 week', '1 month')"
          )}
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadConfiguration;
