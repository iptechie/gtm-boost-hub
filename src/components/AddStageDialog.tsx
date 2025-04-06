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
import { Textarea } from "@/components/ui/textarea";
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
  const [stageDescription, setStageDescription] = useState("");
  const [stageColor, setStageColor] = useState("#3B82F6");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) return;

    setIsLoading(true);
    try {
      const newStage = await addPipelineStage({
        name: stageName.trim(),
        description: stageDescription.trim(),
        color: stageColor,
      });
      onStageAdded(newStage);
      onClose();
      setStageName("");
      setStageDescription("");
      setStageColor("#3B82F6");
      toast.success("Stage added successfully");
    } catch (error) {
      console.error("Failed to add stage:", error);
      toast.error("Failed to add stage");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setStageName("");
      setStageDescription("");
      setStageColor("#3B82F6");
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pipeline Stage</DialogTitle>
          <DialogDescription>
            Create a new stage in your sales pipeline.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="stage-description"
                value={stageDescription}
                onChange={(e) => setStageDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe what this stage represents"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage-color" className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="stage-color"
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
