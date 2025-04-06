import React, { useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
import { FeatureGate } from "@/components/FeatureGate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
}

interface PipelineManagementProps {
  stages: PipelineStage[];
  onAddStage: (stage: Omit<PipelineStage, "id">) => void;
  onEditStage: (id: string, stage: Partial<PipelineStage>) => void;
  onDeleteStage: (id: string) => void;
  onReorderStages: (stages: PipelineStage[]) => void;
}

export const PipelineManagement: React.FC<PipelineManagementProps> = ({
  stages,
  onAddStage,
  onEditStage,
  onDeleteStage,
  onReorderStages,
}) => {
  const { canAccessPipelineFeature, getMaxPipelineStages } = useSubscription();
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [newStage, setNewStage] = useState({
    name: "",
    description: "",
    color: "#000000",
  });

  const handleAddStage = () => {
    if (stages.length >= getMaxPipelineStages()) {
      return;
    }
    onAddStage({
      ...newStage,
      order: stages.length,
    });
    setNewStage({ name: "", description: "", color: "#000000" });
    setIsAddingStage(false);
  };

  const handleEditStage = () => {
    if (!editingStage) return;
    onEditStage(editingStage.id, {
      name: editingStage.name,
      description: editingStage.description,
      color: editingStage.color,
    });
    setEditingStage(null);
  };

  const handleDeleteStage = (id: string) => {
    onDeleteStage(id);
  };

  const canAddStage = canAccessPipelineFeature("canAdd");
  const canEditStage = canAccessPipelineFeature("canEdit");
  const canDeleteStage = canAccessPipelineFeature("canDelete");
  const maxStages = getMaxPipelineStages();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pipeline Stages</h2>
        <FeatureGate
          pipelineFeature="canAdd"
          fallback={
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Feature Locked</AlertTitle>
              <AlertDescription>
                Upgrade your plan to add more pipeline stages
              </AlertDescription>
            </Alert>
          }
        >
          <Dialog open={isAddingStage} onOpenChange={setIsAddingStage}>
            <DialogTrigger asChild>
              <Button disabled={stages.length >= maxStages}>Add Stage</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Pipeline Stage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newStage.name}
                    onChange={(e) =>
                      setNewStage({ ...newStage, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newStage.description}
                    onChange={(e) =>
                      setNewStage({ ...newStage, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <ColorPicker
                    id="color"
                    value={newStage.color}
                    onChange={(color) => setNewStage({ ...newStage, color })}
                  />
                </div>
                <Button onClick={handleAddStage}>Add Stage</Button>
              </div>
            </DialogContent>
          </Dialog>
        </FeatureGate>
      </div>

      <div className="grid gap-4">
        {stages.map((stage) => (
          <Card key={stage.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{stage.name}</span>
                <div className="space-x-2">
                  <FeatureGate pipelineFeature="canEdit">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStage(stage)}
                    >
                      Edit
                    </Button>
                  </FeatureGate>
                  <FeatureGate pipelineFeature="canDelete">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      Delete
                    </Button>
                  </FeatureGate>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stage.description}
              </p>
              <div
                className="w-4 h-4 rounded-full mt-2"
                style={{ backgroundColor: stage.color }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingStage} onOpenChange={() => setEditingStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pipeline Stage</DialogTitle>
          </DialogHeader>
          {editingStage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingStage.name}
                  onChange={(e) =>
                    setEditingStage({
                      ...editingStage,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingStage.description}
                  onChange={(e) =>
                    setEditingStage({
                      ...editingStage,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-color">Color</Label>
                <ColorPicker
                  id="edit-color"
                  value={editingStage.color}
                  onChange={(color) =>
                    setEditingStage({
                      ...editingStage,
                      color,
                    })
                  }
                />
              </div>
              <Button onClick={handleEditStage}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineManagement;
