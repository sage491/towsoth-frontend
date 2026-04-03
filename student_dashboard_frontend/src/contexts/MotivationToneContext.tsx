import { createContext, useContext, ReactNode } from 'react';
import { usePreferences } from './PreferencesContext';

export type MotivationTone = 'calm' | 'competitive' | 'supportive';

export interface MotivationToneContextValue {
  tone: MotivationTone;
  setTone: (tone: MotivationTone) => void;
}

const MotivationToneContext = createContext<MotivationToneContextValue | undefined>(undefined);

export function MotivationToneProvider({ children }: { children: ReactNode }) {
  const { preferences, updatePreference } = usePreferences();

  const setTone = (newTone: MotivationTone): void => {
    updatePreference('motivationTone', newTone);
  };

  return (
    <MotivationToneContext.Provider value={{ tone: preferences.motivationTone, setTone }}>
      {children}
    </MotivationToneContext.Provider>
  );
}

export function useMotivationTone(): MotivationToneContextValue {
  const context = useContext(MotivationToneContext);
  if (context === undefined) {
    throw new Error('useMotivationTone must be used within a MotivationToneProvider');
  }
  return context;
}