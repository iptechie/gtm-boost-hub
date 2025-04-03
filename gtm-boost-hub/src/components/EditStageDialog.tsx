import React, { useState, useEffect } from "react";
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
import { updatePipelineStage, PipelineStage } from "@/lib/api"; // Import API function and type

interface EditStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stage: PipelineStage | undefined; // The stage to edit
  onStageUpdated: (updatedStage: PipelineStage) => void;
}

const EditStageDialog: React.FC<EditStageDialogProps> = ({
  isOpen,
  onClose,
  stage,
  onStageUpdated,
}) => {
  const [stageName, setStageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // TODO: Add color selection later

  // Pre-fill form when dialog opens with a valid stage
  useEffect(() => {
    if (isOpen && stage) {
      setStageName(stage.name);
      // Reset color state here if added later
    } else if (!isOpen) {
      // Reset when closing
      setStageName("");
      setIsLoading(false);
    }
  }, [isOpen, stage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stage) {
      toast.error("No stage selected for editing.");
      return;
    }
    if (!stageName.trim()) {
      toast.error("Stage name cannot be empty.");
      return;
    }
    if (stageName.trim() === stage.name) {
      toast.info("No changes detected.");
      onClose(); // Close if no changes
      return;
    }

    setIsLoading(true);
    try {
      // Only sending name for now. Color can be added later.
      const updatedStage = await updatePipelineStage(stage.id, {
        name: stageName.trim(),
        // color: newColor, // Add color update later
      });
      toast.success(`Stage "${stage.name}" updated to "${updatedStage.name}"!`);
      onStageUpdated(updatedStage); // Pass the updated stage back
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Failed to update stage:", error);
      toast.error(
        `Failed to update stage: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pipeline Stage</DialogTitle>
          <DialogDescription>
            Update the name for the "{stage?.name}" stage.
          </DialogDescription>
        </DialogHeader>
        {stage ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stage-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-stage-name"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="col-span-3"
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
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !stageName.trim() ||
                  stageName.trim() === stage.name
                }
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // Optional: Show a message if stage data is missing
          <p className="py-4 text-center text-slate-500">
            Stage data not available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditStageDialog;
