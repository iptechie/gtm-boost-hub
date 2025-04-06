import React, { useState, useEffect } from "react"; // Added useEffect
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deletePipelineStage, PipelineStage } from "@/lib/api"; // Import API function and type

interface DeleteStageConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  stage: PipelineStage | undefined; // The stage to delete
  onConfirmDelete: (stageId: string) => void; // Callback after successful deletion
}

const DeleteStageConfirmation: React.FC<DeleteStageConfirmationProps> = ({
  isOpen,
  onClose,
  stage,
  onConfirmDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!stage) {
      toast.error("No stage selected for deletion.");
      return;
    }
    setIsLoading(true);
    try {
      await deletePipelineStage(stage.id);
      toast.success(`Stage "${stage.name}" deleted successfully.`);
      onConfirmDelete(stage.id); // Notify parent component
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Failed to delete stage:", error);
      toast.error(
        `Failed to delete stage: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset loading state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Deleting the stage "{stage?.name}"
            will move all leads within it to the first stage in the pipeline
            (based on current mock logic). Do you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          {/* Use a regular button styled as destructive for the action */}
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Stage"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStageConfirmation;
