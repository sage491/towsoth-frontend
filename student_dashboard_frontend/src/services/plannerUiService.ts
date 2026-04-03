import { mockPlannerBestTimeSlots, mockPlannerClassHours, mockPlannerTimetable, type PlannerTimeSlot } from "@/mocks/mockPlannerUi";

export type { PlannerTimeSlot };

export async function getPlannerTimetable(): Promise<PlannerTimeSlot[]> {
  // Future API call
  // return apiRequest<PlannerTimeSlot[]>("/planner/timetable");
  return Promise.resolve(mockPlannerTimetable.map((slot) => ({ ...slot })));
}

export async function getPlannerBestTimeSlots(): Promise<string[]> {
  // Future API call
  // return apiRequest<string[]>("/planner/best-time-slots");
  return Promise.resolve([...mockPlannerBestTimeSlots]);
}

export async function getPlannerClassHours(): Promise<string[]> {
  // Future API call
  // return apiRequest<string[]>("/planner/class-hours");
  return Promise.resolve([...mockPlannerClassHours]);
}
