import React, { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, FileDown, Import } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => Promise<void>;
}

const ImportLeadsDialog: React.FC<ImportLeadsDialogProps> = ({
  open,
  onOpenChange,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // Add uploading state

  const handleDownloadTemplate = () => {
    const a = document.createElement("a");
    a.href = "/leads-import-template.csv";
    a.download = "leads-import-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.info("Template CSV downloaded.");
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      toast.info(`File selected: ${file.name}`);
    } else if (file) {
      toast.error("Invalid file type. Please upload a CSV file.");
      setSelectedFile(null);
    } else {
      setSelectedFile(null);
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files ? event.target.files[0] : null);
    if (event.target) event.target.value = "";
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
  }, []);

  const handleUploadClick = async () => {
    if (!selectedFile) {
      toast.error("No file selected for upload.");
      return;
    }
    setIsUploading(true); // Set uploading state
    try {
      await onUpload(selectedFile);
      setSelectedFile(null); // Clear selection
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      // Error toast is handled in the onUpload implementation in LeadsPage
      console.error("Upload failed in Dialog:", error);
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // Reset state when dialog closes
  const handleOpenChangeWithReset = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedFile(null);
      setIsDragging(false);
      setIsUploading(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWithReset}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
          <DialogDescription>
            Upload a CSV file with lead information. Download the template to
            see the required format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Download Template Button */}
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="w-full justify-start"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Template (.csv)
          </Button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept=".csv"
            className="hidden"
          />

          {/* Drag and Drop Area / Select File Button */}
          <div
            className={cn(
              "border-2 border-dashed border-border rounded-md p-6 text-center text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors",
              isDragging && "border-primary bg-primary/10"
            )}
            onClick={handleSelectFileClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadCloud size={32} className="mx-auto mb-2" />
            {selectedFile ? (
              <span className="text-sm break-words">
                Selected: {selectedFile.name}
              </span>
            ) : (
              <span className="text-sm">
                Drag & drop CSV file here, or click to select
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleUploadClick}
            disabled={!selectedFile || isUploading} // Disable if no file or uploading
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Import className="mr-2 h-4 w-4" /> Upload File
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportLeadsDialog;
