
import React from 'react';
import SignUpForm from '../components/SignUpForm';

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-fade-in">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
