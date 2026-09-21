import React from 'react';
import { ClerkProvider, useAuth } from '@clerk/react';
import { SignInButton, SignOutButton } from '@clerk/react';

export { SignInButton, SignOutButton };
export const useClerkAuth = useAuth;

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

export const ClerkProviderWrapper: React.FC<ClerkProviderWrapperProps> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
};
