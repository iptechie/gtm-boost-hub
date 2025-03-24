
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedCount: number;
  onUpdateStage: (stage: string) => void;
  onDeleteSelected: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedCount, 
  onUpdateStage, 
  onDeleteSelected 
}) => {
  const [showStageDialog, setShowStageDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState("");

  const stageOptions = [
    "New", 
    "Contacted", 
    "Qualified", 
    "Discovery Meeting", 
    "Demo", 
    "Proposal", 
    "Negotiation", 
    "Won", 
    "Lost"
  ];

  const handleUpdateStage = () => {
    if (selectedStage) {
      onUpdateStage(selectedStage);
      setShowStageDialog(false);
      toast.success(`Updated ${selectedCount} leads to stage: ${selectedStage}`);
    }
  };

  const handleDelete = () => {
    onDeleteSelected();
    setShowDeleteDialog(false);
    toast.success(`Deleted ${selectedCount} leads`);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium">
        {selectedCount} lead{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Bulk Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowStageDialog(true)}>
            Update Stage
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Stage Dialog */}
      <Dialog open={showStageDialog} onOpenChange={setShowStageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead Stage</DialogTitle>
            <DialogDescription>
              Change the stage for {selectedCount} selected leads.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Select New Stage</label>
            <Select onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStage} disabled={!selectedStage}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Leads</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected leads? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkActions;
