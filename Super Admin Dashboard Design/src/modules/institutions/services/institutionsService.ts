import type { Institution } from "../../../types/domain";
import type { InstitutionsFeature } from "../types";

export const INSTITUTION_FEATURES: InstitutionsFeature[] = [
  { id: "attendance", name: "Attendance Tracking", description: "Real-time attendance monitoring" },
  { id: "timetable", name: "Timetable Management", description: "Automated scheduling system" },
  { id: "ai-scoring", name: "AI Content Scoring", description: "AI-powered assessment and grading" },
  { id: "analytics", name: "Advanced Analytics", description: "Comprehensive data insights" },
  { id: "research", name: "Research Tracking", description: "Research project management" },
  { id: "custom-integrations", name: "Custom Integrations", description: "API access and custom integrations" },
];

export function filterInstitutions(institutions: Institution[], searchTerm: string, planFilter: string): Institution[] {
  const normalizedSearch = searchTerm.toLowerCase();

  return institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(normalizedSearch) ||
      institution.country.toLowerCase().includes(normalizedSearch);
    const matchesPlan = planFilter === "all" || institution.plan === planFilter;

    return matchesSearch && matchesPlan;
  });
}
