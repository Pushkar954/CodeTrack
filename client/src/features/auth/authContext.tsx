import React from 'react';

export function useClerkAuth() {
  const userId = localStorage.getItem('clerk_user_id');
  const isSignedIn = !!userId;
  return { userId, isSignedIn, isLoaded: true };
}

export function SignInButton() {
  return null;
}

export const ClerkProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
