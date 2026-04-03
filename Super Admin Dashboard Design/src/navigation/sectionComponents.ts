import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import type { AppSectionId } from "../types/navigation";

type SectionComponent = LazyExoticComponent<ComponentType>;

export const SECTION_COMPONENTS: Record<AppSectionId, SectionComponent> = {
  dashboard: lazy(() => import("../components/Dashboard").then((module) => ({ default: module.Dashboard }))),
  institutions: lazy(() => import("../components/Institutions").then((module) => ({ default: module.Institutions }))),
  plans: lazy(() => import("../components/PlansFeatures").then((module) => ({ default: module.PlansFeatures }))),
  roles: lazy(() => import("../components/RolesPermissions").then((module) => ({ default: module.RolesPermissions }))),
  users: lazy(() => import("../components/Users").then((module) => ({ default: module.Users }))),
  "ai-control": lazy(() => import("../components/AIControlCenter").then((module) => ({ default: module.AIControlCenter }))),
  compliance: lazy(() => import("../components/Compliance").then((module) => ({ default: module.Compliance }))),
  billing: lazy(() => import("../components/Billing").then((module) => ({ default: module.Billing }))),
  security: lazy(() => import("../components/Security").then((module) => ({ default: module.Security }))),
  analytics: lazy(() => import("../components/Analytics").then((module) => ({ default: module.Analytics }))),
  config: lazy(() => import("../components/SystemConfig").then((module) => ({ default: module.SystemConfig }))),
  governance: lazy(() => import("../components/Governance").then((module) => ({ default: module.Governance }))),
  logs: lazy(() => import("../components/SystemLogs").then((module) => ({ default: module.SystemLogs }))),
  emergency: lazy(() => import("../components/EmergencyControls").then((module) => ({ default: module.EmergencyControls }))),
};
