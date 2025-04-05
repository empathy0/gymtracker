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

export const calisthenicsExercises: Exercise[] = [
  { key: "push-ups", label: "Push-ups", category: "Upper Body" },
  { key: "pull-ups", label: "Pull-ups", category: "Upper Body" },
  { key: "dips", label: "Dips", category: "Upper Body" },
  { key: "bodyweight-squats", label: "Bodyweight Squats", category: "Lower Body" },
  { key: "pistol-squats", label: "Pistol Squats", category: "Lower Body" },
  { key: "lunges", label: "Lunges", category: "Lower Body" },
  { key: "plank", label: "Plank", category: "Core" },
  { key: "l-sit", label: "L-Sit", category: "Core" },
  { key: "handstand", label: "Handstand", category: "Balance" },
  { key: "muscle-up", label: "Muscle-up", category: "Advanced" },
  { key: "front-lever", label: "Front Lever", category: "Advanced" },
  { key: "back-lever", label: "Back Lever", category: "Advanced" },
];
