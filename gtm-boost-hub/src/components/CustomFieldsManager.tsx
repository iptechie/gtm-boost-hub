import React, { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { FieldType } from "@/types/config";

const CustomFieldsManager: React.FC = () => {
  const { config, addCustomField, updateCustomField, deleteCustomField } =
    useConfig();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    type: "text" as FieldType,
    required: false,
    options: [] as string[],
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingField) {
        await updateCustomField({
          ...editingField,
          ...formData,
        });
      } else {
        await addCustomField(formData);
      }
      setIsDialogOpen(false);
      setFormData({
        name: "",
        label: "",
        type: "text",
        required: false,
        options: [],
        description: "",
      });
      setEditingField(null);
    } catch (error) {
      console.error("Error saving custom field:", error);
    }
  };

  const handleEdit = (field: any) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      label: field.label,
      type: field.type,
      required: field.required,
      options: field.options || [],
      description: field.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (fieldId: string) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      try {
        await deleteCustomField(fieldId);
      } catch (error) {
        console.error("Error deleting custom field:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Custom Fields</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingField ? "Edit Custom Field" : "Add Custom Field"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Field Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., company_size"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Display Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="e.g., Company Size"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Field Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as FieldType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="multiselect">Multi-Select</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(formData.type === "select" ||
                formData.type === "multiselect") && (
                <div className="space-y-2">
                  <Label htmlFor="options">Options (one per line)</Label>
                  <textarea
                    id="options"
                    className="w-full min-h-[100px] p-2 border rounded"
                    value={formData.options.join("\n")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional field description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={formData.required}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, required: checked })
                  }
                />
                <Label htmlFor="required">Required Field</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingField ? "Update" : "Add"} Field
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {config?.customFields.map((field) => (
          <div
            key={field.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{field.label}</h3>
              <p className="text-sm text-slate-500">
                {field.name} ({field.type}){field.required && " • Required"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(field)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFieldsManager;
