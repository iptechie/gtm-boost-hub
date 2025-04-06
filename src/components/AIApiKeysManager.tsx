import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  lastUsed?: string;
  status: "active" | "inactive";
}

interface AIApiKeysManagerProps {
  apiKeys?: ApiKey[];
  onSave?: (apiKey: Omit<ApiKey, "id">) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, apiKey: Partial<ApiKey>) => void;
}

export const AIApiKeysManager: React.FC<AIApiKeysManagerProps> = ({
  apiKeys = [],
  onSave,
  onDelete,
  onUpdate,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    key: "",
    service: "",
  });
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKey.name || !newApiKey.key || !newApiKey.service) {
      toast.error("Please fill in all fields");
      return;
    }
    onSave?.({
      ...newApiKey,
      status: "active",
    });
    setNewApiKey({ name: "", key: "", service: "" });
    setIsAddDialogOpen(false);
    toast.success("API key added successfully");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this API key?")) {
      onDelete?.(id);
      toast.success("API key deleted successfully");
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for various AI services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New API Key</DialogTitle>
                  <DialogDescription>
                    Add a new API key for AI services
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., OpenAI Production"
                      value={newApiKey.name}
                      onChange={(e) =>
                        setNewApiKey({ ...newApiKey, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Input
                      id="service"
                      placeholder="e.g., OpenAI, Google Gemini"
                      value={newApiKey.service}
                      onChange={(e) =>
                        setNewApiKey({ ...newApiKey, service: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">API Key</Label>
                    <Input
                      id="key"
                      type="password"
                      placeholder="Enter your API key"
                      value={newApiKey.key}
                      onChange={(e) =>
                        setNewApiKey({ ...newApiKey, key: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>SERVICE</TableHead>
              <TableHead>API KEY</TableHead>
              <TableHead>LAST USED</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell>{apiKey.name}</TableCell>
                <TableCell>{apiKey.service}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {showKeys[apiKey.id]
                        ? apiKey.key
                        : "•".repeat(Math.min(20, apiKey.key.length))}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{apiKey.lastUsed || "Never"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apiKey.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {apiKey.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onUpdate?.(apiKey.id, {
                          status:
                            apiKey.status === "active" ? "inactive" : "active",
                        })
                      }
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
