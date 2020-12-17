export interface Set {
  weight?: number;
  weightUnits?: 'kg' | 'lb';
  reps?: number;
  time?: number;
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}
