import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Import Link
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Save, Settings2, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import ManageScoringRulesDialog from "@/components/ManageScoringRulesDialog"; // Import the dialog
import {
  fetchScoringConfig,
  updateScoringConfig,
  ScoringConfig,
  ScoringFieldConfig,
  ScoringRule, // Import ScoringRule type
} from "@/lib/api"; // Import API functions and types

const LeadScoringSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<ScoringConfig | null>(null);
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(false);
  const [currentFieldToEdit, setCurrentFieldToEdit] =
    useState<ScoringFieldConfig | null>(null);

  // Fetch current config
  const {
    data: fetchedConfig,
    isLoading,
    error,
  } = useQuery<ScoringConfig>({
    queryKey: ["scoringConfig"],
    queryFn: fetchScoringConfig,
  });

  // Update local state when fetched data is available
  useEffect(() => {
    if (fetchedConfig) {
      setConfig(fetchedConfig);
    }
  }, [fetchedConfig]);

  // Mutation for updating config
  const mutation = useMutation({
    mutationFn: updateScoringConfig,
    onSuccess: (updatedData) => {
      toast.success("Scoring configuration saved successfully!");
      queryClient.setQueryData(["scoringConfig"], updatedData); // Update cache
      setConfig(updatedData); // Update local state
      // Optionally invalidate leads query if scores might change immediately
      // queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err) => {
      toast.error(`Failed to save configuration: ${err.message}`);
    },
  });

  const handleFieldChange = (
    fieldName: string,
    key: keyof ScoringFieldConfig,
    value: string | number | boolean // Use specific types instead of any
  ) => {
    setConfig((prevConfig) => {
      if (!prevConfig) return null;
      const newFields = prevConfig.fields.map((field) => {
        if (field.fieldName === fieldName) {
          let processedValue = value;
          // Ensure weight is a number and within range
          if (key === "weight") {
            // Only parse if it's a string input
            const numValue =
              typeof value === "string"
                ? parseInt(value, 10)
                : typeof value === "number"
                ? value
                : 0;
            processedValue = isNaN(numValue)
              ? 0
              : Math.max(0, Math.min(100, numValue));
          }
          // If activating/deactivating, ensure rules are handled if needed (e.g., clear rules?)
          // If changing weight, update total weight display
          return { ...field, [key]: processedValue };
        }
        return field;
      });
      return { ...prevConfig, fields: newFields };
    });
  };

  const handleOpenRulesDialog = (field: ScoringFieldConfig) => {
    setCurrentFieldToEdit(field);
    setIsRulesDialogOpen(true);
  };

  const handleSaveRules = (fieldName: string, updatedRules: ScoringRule[]) => {
    setConfig((prevConfig) => {
      if (!prevConfig) return null;
      const newFields = prevConfig.fields.map((field) => {
        if (field.fieldName === fieldName) {
          return { ...field, rules: updatedRules };
        }
        return field;
      });
      return { ...prevConfig, fields: newFields };
    });
    // No need to save immediately, user will click main "Save Changes" button
    toast.info(
      `Rules for ${fieldName} updated locally. Save changes to persist.`
    );
  };

  const handleSaveChanges = () => {
    if (!config) return;
    // Validate total weight before saving
    const totalWeight = calculateTotalActiveWeight(config);
    if (totalWeight !== 100) {
      toast.error(
        `Total weight of active fields must be 100%. Current total: ${totalWeight}%`
      );
      return;
    }
    mutation.mutate(config);
  };

  const calculateTotalActiveWeight = (
    currentConfig: ScoringConfig | null
  ): number => {
    if (!currentConfig) return 0;
    return currentConfig.fields.reduce((sum, field) => {
      return field.isActive ? sum + (field.weight || 0) : sum;
    }, 0);
  };

  const totalWeight = useMemo(
    () => calculateTotalActiveWeight(config),
    [config]
  );
  const isWeightInvalid = totalWeight !== 100;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error loading configuration: {error.message}
      </div>
    );
  }

  if (!config) {
    return <div>No configuration data found.</div>; // Should not happen if loading/error handled
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/settings"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Settings
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Lead Scoring Settings</h1>
          <p className="text-slate-500">
            Configure how leads are scored based on their attributes. Define
            rules and weights for different fields.
          </p>
        </div>
        <Button
          onClick={handleSaveChanges}
          disabled={mutation.isPending || isWeightInvalid}
        >
          <Save className="mr-2 h-4 w-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Configuration</CardTitle>
          <div
            className={`flex items-center gap-2 text-sm ${
              isWeightInvalid ? "text-red-600" : "text-green-600"
            }`}
          >
            {isWeightInvalid && <AlertCircle className="h-4 w-4" />}
            <span>
              Total Active Weight: {totalWeight}%{" "}
              {isWeightInvalid && "(Must be 100%)"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.fields.map((field) => (
            <div
              key={field.fieldName}
              className="flex items-center justify-between p-3 border rounded-md gap-4 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3 flex-1">
                <Switch
                  id={`active-${field.fieldName}`}
                  checked={field.isActive}
                  onCheckedChange={(checked) =>
                    handleFieldChange(field.fieldName, "isActive", checked)
                  }
                />
                <Label
                  htmlFor={`active-${field.fieldName}`}
                  className="font-medium min-w-[100px]"
                >
                  {field.label}
                </Label>
              </div>
              <div className="flex items-center gap-2 w-1/4">
                <Label
                  htmlFor={`weight-${field.fieldName}`}
                  className="text-sm text-slate-600"
                >
                  Weight:
                </Label>
                <Input
                  id={`weight-${field.fieldName}`}
                  type="number"
                  min="0"
                  max="100"
                  value={field.weight}
                  onChange={(e) =>
                    handleFieldChange(field.fieldName, "weight", e.target.value)
                  }
                  className="w-20 h-8"
                  disabled={!field.isActive}
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!field.isActive}
                onClick={() => handleOpenRulesDialog(field)} // Open dialog on click
              >
                <Settings2 className="mr-2 h-4 w-4" /> {/* Icon added */}
                Manage Rules ({field.rules.length})
              </Button>
            </div>
          ))}
        </CardContent>
        {/* CardFooter with redundant button removed */}
      </Card>

      {/* Render the Dialog */}
      <ManageScoringRulesDialog
        open={isRulesDialogOpen}
        onOpenChange={setIsRulesDialogOpen}
        fieldConfig={currentFieldToEdit}
        onSaveRules={handleSaveRules}
      />
    </div>
  );
};

export default LeadScoringSettingsPage;
