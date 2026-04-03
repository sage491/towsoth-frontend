import type { PropsWithChildren } from 'react';
import { BrandColorTokens } from '../components/branding/BrandColorTokens';
import { AdminIntelligenceProvider } from '../contexts/AdminIntelligenceContext';
import { AdminModeEngineProvider } from '../contexts/AdminModeEngine';
import { DataProvider } from '../contexts/DataContext';
import { InstitutionBrandingProvider } from '../contexts/InstitutionBrandingEngine';
import { ToastProvider } from '../contexts/ToastContext';
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <DataProvider>
      <UserPreferencesProvider>
        <AdminIntelligenceProvider>
          <AdminModeEngineProvider>
            <InstitutionBrandingProvider>
              <ToastProvider>
                <BrandColorTokens />
                {children}
              </ToastProvider>
            </InstitutionBrandingProvider>
          </AdminModeEngineProvider>
        </AdminIntelligenceProvider>
      </UserPreferencesProvider>
    </DataProvider>
  );
}
