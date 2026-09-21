import React from 'react';
import { SignIn } from '@clerk/react';

export const SignInPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
};
