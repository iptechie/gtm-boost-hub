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
import { Textarea } from "@/components/ui/textarea";
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
  const [stageDescription, setStageDescription] = useState("");
  const [stageColor, setStageColor] = useState("#3B82F6");
  const [isLoading, setIsLoading] = useState(false);

  // Update form when stage changes
  useEffect(() => {
    if (stage) {
      setStageName(stage.name);
      setStageDescription(stage.description || "");
      setStageColor(stage.color || "#3B82F6");
    }
  }, [stage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stage || !stageName.trim()) return;

    setIsLoading(true);
    try {
      const updatedStage = await updatePipelineStage(stage.id, {
        name: stageName.trim(),
        description: stageDescription.trim(),
        color: stageColor,
      });
      onStageUpdated(updatedStage);
      onClose();
      toast.success("Stage updated successfully");
    } catch (error) {
      console.error("Failed to update stage:", error);
      toast.error("Failed to update stage");
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
            Update the details for the "{stage?.name}" stage.
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stage-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-stage-description"
                  value={stageDescription}
                  onChange={(e) => setStageDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Describe what this stage represents"
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stage-color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="edit-stage-color"
                    type="color"
                    value={stageColor}
                    onChange={(e) => setStageColor(e.target.value)}
                    className="w-12 h-8 p-1"
                    disabled={isLoading}
                  />
                  <Input
                    type="text"
                    value={stageColor}
                    onChange={(e) => setStageColor(e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    disabled={isLoading}
                  />
                </div>
              </div>
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
                  (stageName.trim() === stage.name &&
                    stageDescription.trim() === (stage.description || "") &&
                    stageColor === stage.color)
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
