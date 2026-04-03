import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, Info, Pin, PinOff, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAdminIntelligence } from '../../contexts/AdminIntelligenceContext';
import type { DashboardLayer, SmartWidget } from '../../contexts/AdminIntelligenceContext';
import { useIntelligenceDashboardData } from './useIntelligenceDashboardData';

interface IntelligenceWidgetCardProps {
  widget: SmartWidget;
  metricValue: string;
  metricTone: 'default' | 'info' | 'success' | 'warning' | 'danger';
  showExplanations: boolean;
  onPin: (widgetId: string) => void;
  onUnpin: (widgetId: string) => void;
  onSnooze: (widgetId: string, untilIsoDate: string) => void;
}

function IntelligenceWidgetCard({
  widget,
  metricValue,
  metricTone,
  showExplanations,
  onPin,
  onUnpin,
  onSnooze,
}: IntelligenceWidgetCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!widget.visible) {
    return null;
  }

  if (widget.snoozedUntil && new Date(widget.snoozedUntil) > new Date()) {
    return null;
  }

  const priorityClasses: Record<SmartWidget['priority'], string> = {
    critical: 'border-l-[#dc2626]',
    high: 'border-l-[#f59e0b]',
    medium: 'border-l-[#3b82f6]',
    low: 'border-l-[#6b7280]',
  };

  return (
    <article className={`relative border border-[#d1d5db] border-l-4 bg-white p-4 ${priorityClasses[widget.priority]}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-[13px] text-[#111827]">{widget.title}</h3>
            {widget.pinned ? <Pin className="h-3 w-3 text-[#6b7280]" /> : null}
          </div>

          {showExplanations ? (
            <button
              type="button"
              onClick={() => setShowExplanation((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] text-[#6b7280] transition-colors hover:text-[#374151]"
            >
              <Info className="h-3 w-3" />
              Why am I seeing this?
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => (widget.pinned ? onUnpin(widget.id) : onPin(widget.id))}
            className="p-1 transition-colors hover:bg-[#f3f4f6]"
            title={widget.pinned ? 'Unpin widget' : 'Pin widget'}
          >
            {widget.pinned ? <PinOff className="h-3 w-3 text-[#6b7280]" /> : <Pin className="h-3 w-3 text-[#6b7280]" />}
          </button>
          <button
            type="button"
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              onSnooze(widget.id, tomorrow.toISOString());
            }}
            className="p-1 transition-colors hover:bg-[#f3f4f6]"
            title="Snooze for one day"
          >
            <Clock className="h-3 w-3 text-[#6b7280]" />
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-[24px] text-[#111827]">{metricValue}</p>
        <StatusBadge label={widget.priority} tone={metricTone} />
      </div>

      {showExplanation ? (
        <div className="mt-3 border-t border-[#e5e7eb] pt-3">
          <div className="bg-[#f9fafb] p-3 text-[11px] leading-relaxed">
            <p className="mb-2 text-[#111827]">
              <span className="font-medium">Data Source:</span> {widget.dataSource}
            </p>
            <p className="mb-2 text-[#6b7280]">{widget.explanation}</p>
            {widget.suggestedAction ? (
              <p className="text-[#3b82f6]">
                <span className="font-medium">Suggested Action:</span> {widget.suggestedAction}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

interface DashboardLayerSectionProps {
  layer: DashboardLayer;
  widgets: SmartWidget[];
  showExplanations: boolean;
  metrics: Record<string, { value: string; tone: 'default' | 'info' | 'success' | 'warning' | 'danger' }>;
  onCollapse: (layerId: string) => void;
  onExpand: (layerId: string) => void;
  onPin: (widgetId: string) => void;
  onUnpin: (widgetId: string) => void;
  onSnooze: (widgetId: string, untilIsoDate: string) => void;
}

function DashboardLayerSection({
  layer,
  widgets,
  showExplanations,
  metrics,
  onCollapse,
  onExpand,
  onPin,
  onUnpin,
  onSnooze,
}: DashboardLayerSectionProps) {
  const layerIconMap: Record<string, ReactElement> = {
    'core-health': <CheckCircle className="h-4 w-4" />,
    'action-required': <AlertTriangle className="h-4 w-4" />,
    'insights-intelligence': <TrendingUp className="h-4 w-4" />,
  };

  const layerWidgets = layer.widgets
    .map((widgetId) => widgets.find((widget) => widget.id === widgetId))
    .filter((widget): widget is SmartWidget => Boolean(widget));

  return (
    <section className="border border-[#d1d5db] bg-[#f9fafb] p-4" aria-labelledby={`${layer.id}-heading`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {layerIconMap[layer.id] ?? null}
          <h2 id={`${layer.id}-heading`} className="text-[15px] text-[#111827]">
            {layer.name}
          </h2>
          <span className="text-[11px] text-[#6b7280]">({layerWidgets.length} widgets)</span>
        </div>

        <button
          type="button"
          onClick={() => (layer.collapsed ? onExpand(layer.id) : onCollapse(layer.id))}
          className="p-1 transition-colors hover:bg-white"
          aria-label={layer.collapsed ? 'Expand layer' : 'Collapse layer'}
        >
          {layer.collapsed ? (
            <ChevronDown className="h-4 w-4 text-[#6b7280]" />
          ) : (
            <ChevronUp className="h-4 w-4 text-[#6b7280]" />
          )}
        </button>
      </div>

      {layer.collapsed ? (
        <p className="text-[12px] italic text-[#6b7280]">Click to expand and view widgets</p>
      ) : layerWidgets.length ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {layerWidgets.map((widget) => {
            const metric = metrics[widget.id] ?? { value: 'Configured', tone: 'default' as const };
            return (
              <IntelligenceWidgetCard
                key={widget.id}
                widget={widget}
                metricValue={metric.value}
                metricTone={metric.tone}
                showExplanations={showExplanations}
                onPin={onPin}
                onUnpin={onUnpin}
                onSnooze={onSnooze}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState title="No widgets available" description="Enable widgets to populate this layer." />
      )}
    </section>
  );
}

export function IntelligenceDashboard() {
  const { collapseLayer, expandLayer, pinWidget, unpinWidget, snoozeWidget } = useAdminIntelligence();
  const { layers, widgets, showExplanations, metrics } = useIntelligenceDashboardData();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Intelligence Dashboard"
        subtitle="Adaptive widget layers for core health, actions, and insights"
      />

      {layers.length ? (
        layers.map((layer) => (
          <DashboardLayerSection
            key={layer.id}
            layer={layer}
            widgets={widgets}
            showExplanations={showExplanations}
            metrics={metrics}
            onCollapse={collapseLayer}
            onExpand={expandLayer}
            onPin={pinWidget}
            onUnpin={unpinWidget}
            onSnooze={snoozeWidget}
          />
        ))
      ) : (
        <EmptyState title="No dashboard layers configured" description="Create or enable layers to display intelligence widgets." />
      )}
    </div>
  );
}
