import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Import Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
// Import Calendar if needed for custom date range
// import { Calendar } from "@/components/ui/calendar";

// Define the structure for additional filters
export interface MoreFilters {
  industry?: string;
  source?: string; // Added source
  jobTitle?: string; // Added jobTitle
  lastContactRange?: string; // e.g., 'mtd', 'last_quarter', 'custom'
  lastContactStartDate?: Date;
  lastContactEndDate?: Date;
  scoreRange?: [number, number]; // Min/Max score
}

interface MoreFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: MoreFilters;
  onApplyFilters: (filters: MoreFilters) => void;
}

// Define the list of industries (reuse from EditLeadDialog)
const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Media",
  "Transportation",
  "Energy",
  "Other",
];

// Define the list of sources (reuse from AddLeadDialog)
const sourceOptions = [
  "Website",
  "Email",
  "Web Form",
  "LinkedIn",
  "Database",
  "Instagram",
  "Facebook",
  "Custom",
];

const MoreFiltersSheet: React.FC<MoreFiltersSheetProps> = ({
  open,
  onOpenChange,
  currentFilters,
  onApplyFilters,
}) => {
  // Internal state to manage changes within the sheet before applying
  const [sheetFilters, setSheetFilters] =
    React.useState<MoreFilters>(currentFilters);

  // Update internal state when currentFilters prop changes (e.g., on initial open)
  React.useEffect(() => {
    setSheetFilters(currentFilters);
  }, [currentFilters, open]); // Re-sync if filters change while sheet is open or on open

  const handleApply = () => {
    // Filter out empty string for jobTitle before applying
    const filtersToApply = { ...sheetFilters };
    if (filtersToApply.jobTitle === "") {
      delete filtersToApply.jobTitle;
    }
    onApplyFilters(filtersToApply);
    onOpenChange(false); // Close the sheet
  };

  const handleValueChange = (
    key: keyof MoreFilters,
    value: string | undefined
  ) => {
    setSheetFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSliderChange = (value: [number, number]) => {
    setSheetFilters((prev) => ({ ...prev, scoreRange: value }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>More Filters</SheetTitle>
          <SheetDescription>
            Apply additional filters to narrow down your leads.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          {/* Industry Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right col-span-1">
              Industry
            </Label>
            <Select
              value={sheetFilters.industry || "all"}
              onValueChange={(value) =>
                handleValueChange(
                  "industry",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industryOptions.map((industry) => (
                  <SelectItem
                    key={industry}
                    value={industry.toLowerCase()} // Use lowercase value for consistency
                  >
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right col-span-1">
              Source
            </Label>
            <Select
              value={sheetFilters.source || "all"}
              onValueChange={(value) =>
                handleValueChange("source", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sourceOptions.map((source) => (
                  <SelectItem
                    key={source}
                    value={source.toLowerCase()} // Use lowercase value
                  >
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Title Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobTitle" className="text-right col-span-1">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g., CEO, Manager"
              value={sheetFilters.jobTitle || ""}
              onChange={(e) => handleValueChange("jobTitle", e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Last Contact Date Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastContact" className="text-right col-span-1">
              Last Contact
            </Label>
            <Select
              value={sheetFilters.lastContactRange || "all"}
              onValueChange={(value) =>
                handleValueChange(
                  "lastContactRange",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="mtd">Month to Date</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                <SelectItem value="last_quarter">Last Quarter</SelectItem>
                <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
                {/* <SelectItem value="custom">Custom Range</SelectItem> */}
                {/* TODO: Add custom range picker logic if needed */}
              </SelectContent>
            </Select>
            {/* TODO: Add Calendar inputs for custom range */}
          </div>

          {/* Lead Score Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right col-span-1">
              Score Range
            </Label>
            <div className="col-span-3 space-y-2">
              <Slider
                id="score"
                min={0}
                max={100}
                step={5}
                value={sheetFilters.scoreRange || [0, 100]}
                onValueChange={handleSliderChange}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {sheetFilters.scoreRange ? sheetFilters.scoreRange[0] : 0}%
                </span>
                <span>
                  {sheetFilters.scoreRange ? sheetFilters.scoreRange[1] : 100}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button type="button" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MoreFiltersSheet;
