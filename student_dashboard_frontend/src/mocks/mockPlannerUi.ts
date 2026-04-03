export interface PlannerTimeSlot {
  time: string;
  title: string;
  type: "class" | "free" | "break";
  subject?: string;
}

export const mockPlannerTimetable: PlannerTimeSlot[] = [
  { time: "08:00", title: "Physics Lecture", type: "class", subject: "Physics" },
  { time: "09:30", title: "Free Period", type: "free" },
  { time: "10:00", title: "Chemistry Lab", type: "class", subject: "Chemistry" },
  { time: "12:00", title: "Lunch Break", type: "break" },
  { time: "13:00", title: "Mathematics", type: "class", subject: "Mathematics" },
  { time: "14:30", title: "Free Period", type: "free" },
  { time: "15:00", title: "Free Period", type: "free" },
  { time: "16:00", title: "Biology Lecture", type: "class", subject: "Biology" },
  { time: "17:30", title: "Free Period", type: "free" },
  { time: "18:00", title: "Free Period", type: "free" },
  { time: "19:00", title: "Free Period", type: "free" },
  { time: "20:00", title: "Free Period", type: "free" },
];

export const mockPlannerBestTimeSlots = ["19:00", "20:00", "15:00"] as const;
export const mockPlannerClassHours = ["08:00", "10:00", "13:00", "16:00"] as const;
