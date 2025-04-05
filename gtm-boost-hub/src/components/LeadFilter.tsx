import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import type { Lead, LeadConfiguration } from "@/types/lead";

interface LeadFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  configuration: LeadConfiguration;
}

interface FilterOptions {
  status?: Lead["status"];
  category?: string;
  industry?: string;
  source?: string;
  scoreRange?: [number, number];
  timeline?: Lead["timeline"];
  activityDetails?: string;
}

const LeadFilter: React.FC<LeadFilterProps> = ({
  onSearch,
  onFilter,
  configuration,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    scoreRange: [0, 100],
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: FilterOptions[keyof FilterOptions]
  ) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleScoreRangeChange = (value: number[]) => {
    const newFilters = {
      ...filters,
      scoreRange: [value[0], value[1]] as [number, number],
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterOptions = {
      scoreRange: [0, 100],
    };
    setFilters(defaultFilters);
    onFilter(defaultFilters);
    setSearchQuery("");
    onSearch("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.category) count++;
    if (filters.industry) count++;
    if (filters.source) count++;
    if (filters.timeline) count++;
    if (filters.activityDetails) count++;
    if (
      filters.scoreRange &&
      (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100)
    )
      count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md h-full flex flex-col">
            <div className="flex items-center justify-between">
              <SheetHeader className="flex-1">
                <SheetTitle>Filter Leads</SheetTitle>
                <SheetDescription>
                  Apply filters to narrow down your leads
                </SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 py-4">
                {/* Activity Details Filter */}
                <div className="space-y-2">
                  <Label>Activity Details</Label>
                  <Input
                    placeholder="Search in activity details..."
                    value={filters.activityDetails || ""}
                    onChange={(e) =>
                      handleFilterChange("activityDetails", e.target.value)
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Search through call notes, emails, and other activities
                  </p>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "status",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {configuration.statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "category",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {configuration.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Filter */}
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={filters.industry || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "industry",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {configuration.industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Source Filter */}
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select
                    value={filters.source || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "source",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {configuration.sources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline Filter */}
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select
                    value={filters.timeline || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "timeline",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Timelines</SelectItem>
                      {configuration.timelines.map((timeline) => (
                        <SelectItem key={timeline} value={timeline}>
                          {timeline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Score Range Filter */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Score Range</Label>
                    <span className="text-sm text-muted-foreground">
                      {filters.scoreRange?.[0]} - {filters.scoreRange?.[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={filters.scoreRange}
                    onValueChange={handleScoreRangeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default LeadFilter;
