import { Focus } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';

export function FocusModeIndicator() {
  const { preferences } = usePreferences();

  if (!preferences.focusMode) return null;

  return (
    <div className="fixed top-[72px] right-6 z-50 flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold shadow-lg">
      <Focus className="w-3.5 h-3.5" />
      <span>Focus Mode Active</span>
    </div>
  );
}
