export interface RevisionPlannerConfig {
  subjects: string[];
  topicsBySubject: Record<string, string[]>;
  timeSlots: string[];
}

export const mockRevisionPlannerConfig: RevisionPlannerConfig = {
  subjects: ["Chemistry", "Mathematics", "Physics", "Biology"],
  topicsBySubject: {
    Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Chemical Bonding"],
    Mathematics: ["Calculus", "Algebra", "Trigonometry", "Coordinate Geometry"],
    Physics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"],
    Biology: ["Cell Biology", "Genetics", "Ecology", "Human Physiology"],
  },
  timeSlots: [
    "Early Morning (5-7 AM)",
    "Morning (7-9 AM)",
    "Mid-Morning (9-11 AM)",
    "Noon (11 AM-1 PM)",
    "Afternoon (1-3 PM)",
    "Evening (3-5 PM)",
    "Late Evening (5-7 PM)",
    "Night (7-9 PM)",
    "Late Night (9-11 PM)",
  ],
};
