import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addPipelineStage, PipelineStage } from "@/lib/api"; // Import API function and type

interface AddStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStageAdded: (newStage: PipelineStage) => void;
}

const AddStageDialog: React.FC<AddStageDialogProps> = ({
  isOpen,
  onClose,
  onStageAdded,
}) => {
  const [stageName, setStageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // TODO: Add color selection later if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) {
      toast.error("Stage name cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      // For now, only sending name. Color can be added later.
      const newStage = await addPipelineStage({ name: stageName.trim() });
      toast.success(`Stage "${newStage.name}" added successfully!`);
      onStageAdded(newStage); // Pass the new stage back to the parent
      setStageName(""); // Reset form
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Failed to add stage:", error);
      toast.error(
        `Failed to add stage: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setStageName("");
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pipeline Stage</DialogTitle>
          <DialogDescription>
            Enter the name for the new stage in your sales pipeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage-name" className="text-right">
                Name
              </Label>
              <Input
                id="stage-name"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Proposal Sent"
                required
                disabled={isLoading}
              />
            </div>
            {/* TODO: Add color input/picker here */}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !stageName.trim()}>
              {isLoading ? "Adding..." : "Add Stage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStageDialog;
