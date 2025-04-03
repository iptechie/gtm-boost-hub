import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Filter,
  ArrowDownUp,
  Calendar as CalendarIcon,
  X, // Import X icon for clear button
} from "lucide-react";
import { DateRange } from "react-day-picker"; // Import DateRange type
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isToday } from "date-fns"; // Keep isToday import for potential future use
import { cn } from "@/lib/utils"; // Import cn utility
import { debounce } from "lodash-es"; // Using lodash for debouncing location input
import MoreFiltersSheet, { MoreFilters } from "./MoreFiltersSheet"; // Import the sheet component

// Export this interface so it can be imported by PipelinePage
export interface ActiveFilters {
  category?: string;
  stage?: string;
  location?: string;
  lastCommunicationDateRange?: DateRange; // Renamed from dateRange for clarity
  industry?: string;
  // lastContactRange?: string; // Removed as redundant with lastCommunicationDateRange
  scoreRange?: [number, number];
}

interface LeadFilterProps {
  onSearch: (value: string) => void;
  onFilter: (filters: ActiveFilters) => void;
}

const LeadFilter: React.FC<LeadFilterProps> = ({ onSearch, onFilter }) => {
  // State for filters managed directly by this component
  const [basicFilters, setBasicFilters] = React.useState<
    Partial<ActiveFilters>
  >({});
  // State for filters managed by the MoreFiltersSheet
  const [moreFilters, setMoreFilters] = React.useState<MoreFilters>({});
  // State for controlling the MoreFiltersSheet visibility
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = React.useState(false);
  // State for controlling the Calendar Popover visibility
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Debounced function to call onFilter for location input
  const debouncedOnFilter = React.useCallback(
    debounce((allFilters: ActiveFilters) => onFilter(allFilters), 300),
    [onFilter]
  );

  // Handler for basic filter changes (Category, Stage, Location, LastCommunicationDateRange)
  const handleBasicFilterChange = (
    key: keyof ActiveFilters,
    value: string | DateRange | undefined // Updated value type
  ) => {
    // Special handling for clearing date range
    const isClearingDate =
      key === "lastCommunicationDateRange" && value === undefined;

    const newBasicFilters = {
      ...basicFilters,
      [key]:
        value === "all" || value === "" || isClearingDate ? undefined : value,
    };
    setBasicFilters(newBasicFilters);

    // Combine basic filters with existing 'more' filters before calling onFilter
    const allFilters = { ...newBasicFilters, ...moreFilters };

    if (key === "location") {
      debouncedOnFilter(allFilters);
    } else {
      onFilter(allFilters); // Call immediately for selects/date range
    }
  };

  // Handler specifically for clearing the date range
  const clearDateRange = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent Popover from closing if clicking inside
    handleBasicFilterChange("lastCommunicationDateRange", undefined);
    setIsCalendarOpen(false); // Close popover when clearing
  };

  // Handler for Calendar onSelect - updates filter and closes popover if range complete
  const handleCalendarSelect = (range: DateRange | undefined) => {
    handleBasicFilterChange("lastCommunicationDateRange", range);
    // Close popover if both 'from' and 'to' dates are selected
    if (range?.from && range?.to) {
      // Use setTimeout to ensure state update happens after current event loop
      setTimeout(() => setIsCalendarOpen(false), 0);
    }
  };

  // Handler for applying filters from the MoreFiltersSheet
  const handleApplyMoreFilters = (newMoreFilters: MoreFilters) => {
    setMoreFilters(newMoreFilters); // Store the applied 'more' filters
    // Call main onFilter with basic filters and new 'more' filters merged
    onFilter({ ...basicFilters, ...newMoreFilters });
  };

  const lastCommunicationDateRange = basicFilters.lastCommunicationDateRange; // Get date range from state

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Category Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select
          value={basicFilters.category || "all"}
          onValueChange={(value) => handleBasicFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {/* Update categories based on mock data */}
            <SelectItem value="Regional">Regional</SelectItem>
            <SelectItem value="Local">Local</SelectItem>
            <SelectItem value="MNC">MNC</SelectItem>
            {/* Add any other categories if known, or keep it dynamic if possible */}
          </SelectContent>
        </Select>
      </div>

      {/* Stage Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select
          value={basicFilters.stage || "all"}
          onValueChange={(value) => handleBasicFilterChange("stage", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Discovery Meeting">Discovery Meeting</SelectItem>
            <SelectItem value="Demo">Demo</SelectItem>
            <SelectItem value="Proposal">Proposal</SelectItem>
            <SelectItem value="Negotiation">Negotiation</SelectItem>
            <SelectItem value="Won">Won</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Filter by Location"
            className="pl-10"
            value={basicFilters.location || ""}
            onChange={(e) =>
              handleBasicFilterChange("location", e.target.value)
            }
          />
        </div>
      </div>

      {/* Date Range Filter & Action Buttons */}
      <div className="flex gap-2 items-center">
        {" "}
        {/* Use items-center */}
        {/* Control Popover open state */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal gap-2", // Adjusted width and added gap
                !lastCommunicationDateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {lastCommunicationDateRange?.from ? (
                lastCommunicationDateRange.to ? (
                  <>
                    {format(lastCommunicationDateRange.from, "LLL dd, y")} -{" "}
                    {format(lastCommunicationDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(lastCommunicationDateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Last Comm. Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={lastCommunicationDateRange?.from}
              selected={lastCommunicationDateRange}
              onSelect={handleCalendarSelect} // Use the updated handler
              numberOfMonths={2}
              // Add the conditional className for the CSS override
              className={cn(
                lastCommunicationDateRange?.from && "range-selected"
              )}
              // Remove the modifiers prop related to 'today'
            />
          </PopoverContent>
        </Popover>
        {/* Clear Date Button */}
        {lastCommunicationDateRange && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearDateRange}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" // Smaller size, subtle styling
            title="Clear date range"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsMoreFiltersOpen(true)} // Open the sheet
        >
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
        <Button variant="outline" className="gap-2">
          <ArrowDownUp className="h-4 w-4" />
          Sort
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Search leads..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Render the More Filters Sheet */}
      <MoreFiltersSheet
        open={isMoreFiltersOpen}
        onOpenChange={setIsMoreFiltersOpen}
        currentFilters={moreFilters} // Pass the current 'more' filters
        onApplyFilters={handleApplyMoreFilters} // Pass the handler
      />
    </div>
  );
};

export default LeadFilter; // Ensure default export
