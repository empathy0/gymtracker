export type TrainingType = "strength" | "cardio";

export interface TrainingRecord {
  id: string;
  type: TrainingType;
  date: string;
  exercise: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  caloriesBurned?: number;
}
