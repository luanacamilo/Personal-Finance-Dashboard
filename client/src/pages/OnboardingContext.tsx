import { createContext, useContext, ReactNode } from 'react';

type OnboardingContextType = {
  navigate: (page: 'welcome' | 'setup' | 'dashboard') => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useNavigate() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useNavigate must be used within OnboardingProvider');
  }
  return context.navigate;
}

interface OnboardingProviderProps {
  children: ReactNode;
  navigate: (page: 'welcome' | 'setup' | 'dashboard') => void;
}

export function OnboardingProvider({ children, navigate }: OnboardingProviderProps) {
  return (
    <OnboardingContext.Provider value={{ navigate }}>
      {children}
    </OnboardingContext.Provider>
  );
}
