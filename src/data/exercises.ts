interface Exercise {
  key: string;
  label: string;
  category: string;
}

export const strengthExercises: Exercise[] = [
  { key: "bench-press", label: "Bench Press", category: "Chest" },
  { key: "squat", label: "Squat", category: "Legs" },
  { key: "deadlift", label: "Deadlift", category: "Back" },
  { key: "shoulder-press", label: "Shoulder Press", category: "Shoulders" },
  { key: "pull-up", label: "Pull-up", category: "Back" },
  { key: "bicep-curl", label: "Bicep Curl", category: "Arms" },
];

export const cardioExercises: Exercise[] = [
  { key: "running", label: "Running", category: "Outdoor" },
  { key: "cycling", label: "Cycling", category: "Indoor/Outdoor" },
  { key: "swimming", label: "Swimming", category: "Pool" },
  { key: "rowing", label: "Rowing", category: "Indoor" },
  { key: "jump-rope", label: "Jump Rope", category: "Indoor" },
  { key: "elliptical", label: "Elliptical", category: "Indoor" },
];
