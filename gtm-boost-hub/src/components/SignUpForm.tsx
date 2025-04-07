
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Logo from './Logo';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: '',
    adminName: '',
    adminEmail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Organization created successfully!");
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <Logo className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Create your GTMcentric Account</h1>
        <p className="text-slate-600">Start boosting your GTM strategy today</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 animate-scale-in">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              name="orgName"
              placeholder="Acme Inc."
              required
              value={formData.orgName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminName">Admin Name</Label>
            <Input
              id="adminName"
              name="adminName"
              placeholder="John Doe"
              required
              value={formData.adminName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              name="adminEmail"
              type="email"
              placeholder="john@acme.com"
              required
              value={formData.adminEmail}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full btn-gradient"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Start Free Trial'}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <a href="/login" className="text-gtm-blue hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
};

export default SignUpForm;
