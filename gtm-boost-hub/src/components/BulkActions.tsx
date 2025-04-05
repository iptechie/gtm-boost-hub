import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import type { Lead } from "@/types/lead";

interface BulkActionsProps {
  selectedCount: number;
  onUpdateStage: (stage: Lead["status"]) => void;
  onDeleteSelected: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onUpdateStage,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Update Stage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onUpdateStage("New")}>
            New
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage("Contacted")}>
            Contacted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage("Qualified")}>
            Qualified
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage("Proposal")}>
            Proposal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage("Negotiation")}>
            Negotiation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage("Closed")}>
            Closed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 hover:text-red-700"
        onClick={onDeleteSelected}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
};

export default BulkActions;
