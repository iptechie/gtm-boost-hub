import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Save } from "lucide-react";
import { ScoringFieldConfig, ScoringRule } from "@/lib/api"; // Import types
import { toast } from "sonner";

interface ManageScoringRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldConfig: ScoringFieldConfig | null;
  onSaveRules: (fieldName: string, updatedRules: ScoringRule[]) => void;
}

// Simple deep copy function for state management
const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const ManageScoringRulesDialog: React.FC<ManageScoringRulesDialogProps> = ({
  open,
  onOpenChange,
  fieldConfig,
  onSaveRules,
}) => {
  const [rules, setRules] = useState<ScoringRule[]>([]);
  const [editingRule, setEditingRule] = useState<ScoringRule | null>(null);
  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);

  useEffect(() => {
    // Reset state when dialog opens with new field config
    if (open && fieldConfig) {
      setRules(deepCopy(fieldConfig.rules || []));
      setEditingRule(null);
      setIsAddEditFormOpen(false);
    } else if (!open) {
      // Clear state when dialog closes
      setRules([]);
      setEditingRule(null);
      setIsAddEditFormOpen(false);
    }
  }, [open, fieldConfig]);

  const handleAddRuleClick = () => {
    setEditingRule({
      id: `new-${Date.now()}`,
      condition: "equals",
      value: "",
      points: 0,
    }); // Default new rule
    setIsAddEditFormOpen(true);
  };

  const handleEditRuleClick = (rule: ScoringRule) => {
    setEditingRule(deepCopy(rule)); // Edit a copy
    setIsAddEditFormOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== ruleId));
    toast.info("Rule removed. Save changes to confirm.");
  };

  const handleSaveRule = (ruleToSave: ScoringRule) => {
    // Basic validation
    if (
      !ruleToSave.condition ||
      ruleToSave.value === undefined ||
      ruleToSave.value === "" ||
      ruleToSave.points === undefined
    ) {
      toast.error(
        "Please fill in all rule details (Condition, Value, Points)."
      );
      return;
    }
    if (
      ruleToSave.condition === "isOneOf" &&
      !Array.isArray(ruleToSave.value)
    ) {
      // Attempt to parse comma-separated string into array for 'isOneOf'
      if (typeof ruleToSave.value === "string") {
        ruleToSave.value = ruleToSave.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        toast.error(
          "Value for 'isOneOf' condition must be a comma-separated list."
        );
        return;
      }
    } else if (
      ruleToSave.condition !== "isOneOf" &&
      Array.isArray(ruleToSave.value)
    ) {
      // Convert array back to string if condition changed from 'isOneOf'
      ruleToSave.value = ruleToSave.value.join(", ");
    }

    setRules((prevRules) => {
      const existingIndex = prevRules.findIndex((r) => r.id === ruleToSave.id);
      if (existingIndex > -1) {
        // Update existing rule
        const updatedRules = [...prevRules];
        updatedRules[existingIndex] = ruleToSave;
        return updatedRules;
      } else {
        // Add new rule
        return [...prevRules, ruleToSave];
      }
    });
    setIsAddEditFormOpen(false);
    setEditingRule(null);
    toast.info("Rule added/updated locally. Save changes to persist.");
  };

  const handleSaveChanges = () => {
    if (fieldConfig) {
      onSaveRules(fieldConfig.fieldName, rules);
      onOpenChange(false); // Close dialog after saving
    }
  };

  const renderValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Manage Rules for: {fieldConfig?.label}</DialogTitle>
        </DialogHeader>

        {/* Add/Edit Rule Form (shown conditionally) */}
        {isAddEditFormOpen && editingRule && (
          <div className="p-4 border rounded-md my-4 space-y-3 bg-slate-50">
            <h4 className="font-medium text-sm">
              {editingRule.id.startsWith("new-") ? "Add New Rule" : "Edit Rule"}
            </h4>
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={editingRule.condition}
                  onValueChange={(value) =>
                    setEditingRule({
                      ...editingRule,
                      condition: value as ScoringRule["condition"],
                    })
                  }
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="isOneOf">
                      Is One Of (comma-sep.)
                    </SelectItem>
                    <SelectItem value="isNotEmpty">Is Not Empty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="value">Value(s)</Label>
                <Input
                  id="value"
                  value={renderValue(editingRule.value)}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, value: e.target.value })
                  }
                  placeholder={
                    editingRule.condition === "isOneOf"
                      ? "e.g., value1, value2"
                      : "Enter value"
                  }
                  disabled={editingRule.condition === "isNotEmpty"}
                />
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={editingRule.points}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      points: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddEditFormOpen(false);
                  setEditingRule(null);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSaveRule(editingRule)}>
                <Save className="mr-2 h-4 w-4" /> Save Rule
              </Button>
            </div>
          </div>
        )}

        {/* Rules Table */}
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead>Value(s)</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500">
                    No rules defined for this field yet.
                  </TableCell>
                </TableRow>
              )}
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.condition}</TableCell>
                  <TableCell>{renderValue(rule.value)}</TableCell>
                  <TableCell>{rule.points}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEditRuleClick(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4 sm:justify-between">
          <Button
            variant="outline"
            onClick={handleAddRuleClick}
            disabled={isAddEditFormOpen}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
          </Button>
          <div>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveChanges} className="ml-2">
              Save Changes to Rules
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageScoringRulesDialog;
