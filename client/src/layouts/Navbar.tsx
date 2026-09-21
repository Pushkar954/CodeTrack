import React from 'react';
import { useClerkAuth, SignOutButton } from '../features/auth/authContext';
import { SignInButton } from '@clerk/react';

export const Logo: React.FC = () => {
  return <span className="text-2xl font-bold text-blue-600">GoalForge AI</span>;
};

export const Navbar: React.FC = () => {
  const { isSignedIn } = useClerkAuth();

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Dashboard</span>
        <span className="text-sm text-gray-600">Problems</span>
        {isSignedIn ? (
          <SignOutButton />
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};
