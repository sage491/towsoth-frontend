import { useAdminIntelligence } from '../../contexts/AdminIntelligenceContext';
import { Brain, AlertTriangle, BarChart3, Check, Info } from 'lucide-react';

export function FeatureControlHub() {
  const { intelligence, enableFeature, disableFeature } = useAdminIntelligence();

  const features = [
    {
      id: 'ai-insights',
      name: 'AI Insights',
      icon: Brain,
      description: 'Automatically analyze patterns in attendance, assessments, and engagement',
    },
    {
      id: 'risk-alerts',
      name: 'Student Risk Alerts',
      icon: AlertTriangle,
      description: 'Early warning system for at-risk students',
    },
    {
      id: 'analytics-charts',
      name: 'Visual Analytics',
      icon: BarChart3,
      description: 'Interactive charts showing trends across students and faculty',
    },
  ];

  const isEnabled = (featureId: string) => intelligence.enabledFeatures.has(featureId);

  const handleToggle = (featureId: string) => {
    if (isEnabled(featureId)) {
      disableFeature(featureId);
    } else {
      enableFeature(featureId);
    }
  };

  return (
    <div className="bg-white border border-[#d1d5db]">
      <div className="px-6 py-4 border-b border-[#d1d5db]">
        <h2 className="text-[17px] text-[#111827] mb-1">Feature Control & Discovery</h2>
        <p className="text-[13px] text-[#6b7280]">
          Enable and manage intelligent features for your institution
        </p>
      </div>

      <div className="p-4 bg-[#f0f9ff] border-b border-[#bae6fd]">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#0c4a6e] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#0c4a6e] leading-relaxed">
            Features marked with ✓ are currently active. Toggle features on/off without losing data.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const enabled = isEnabled(feature.id);

          return (
            <div
              key={feature.id}
              className={`border p-4 ${
                enabled ? 'bg-[#f0f9ff] border-[#bae6fd]' : 'bg-white border-[#d1d5db]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center border ${
                    enabled ? 'bg-[#dbeafe] border-[#93c5fd]' : 'bg-[#f3f4f6] border-[#d1d5db]'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${enabled ? 'text-[#3b82f6]' : 'text-[#9ca3af]'}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px] text-[#111827]">{feature.name}</h4>
                    {enabled && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#dbeafe] border border-[#93c5fd] text-[#3b82f6] text-[10px] uppercase">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6b7280] mb-3">{feature.description}</p>

                  <button
                    onClick={() => handleToggle(feature.id)}
                    className={`px-4 py-2 text-[12px] ${
                      enabled
                        ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                        : 'bg-[#111827] text-white hover:bg-[#374151]'
                    }`}
                  >
                    {enabled ? 'Disable' : 'Enable'} Feature
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
