export type TrainingType = "strength" | "cardio" | "calisthenics";

export interface TrainingRecord {
  id: string;
  type: TrainingType;
  date: string;
  exercise: string;
  sets?: number;
  reps?: number;
  weight?: number;
  bodyWeight?: number;
  duration?: number;
  distance?: number;
  caloriesBurned?: number;
}

export interface UserSettings {
  bodyWeight: number;
  lastUpdated: string;
}
