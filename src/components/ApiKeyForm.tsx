
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, XCircle } from 'lucide-react';

const ApiKeyForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleValidate = () => {
    setIsValidating(true);
    
    // Simulate API validation
    setTimeout(() => {
      const valid = apiKey.length > 20; // Simple validation
      setIsValid(valid);
      setIsValidating(false);
      
      if (valid) {
        toast.success("API key is valid!");
      } else {
        toast.error("Invalid API key. Please check and try again.");
      }
    }, 1500);
  };

  const handleSave = () => {
    if (!isValid) return;
    
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast.success("API key saved successfully!");
    }, 1000);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Gemma API Key</h3>
      <p className="text-sm text-slate-600 mb-6">
        A valid Gemma API key is required to enable AI features like lead scoring and GTM suggestions.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="flex gap-2">
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setIsValid(null);
              }}
              placeholder="Enter your Gemma API key"
              type="password"
              className="flex-1"
            />
            <Button 
              onClick={handleValidate} 
              disabled={!apiKey || isValidating}
              variant="outline"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </Button>
          </div>
        </div>
        
        {isValid !== null && (
          <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>API Key: Active</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>API Key: Invalid</span>
              </>
            )}
          </div>
        )}
        
        <Button 
          className="btn-gradient w-full"
          disabled={!isValid || isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save API Key'}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyForm;
