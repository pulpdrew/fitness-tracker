/**
 * The fields that can be stored in a Set
 */
export enum SetField {
  WEIGHT = 'weight',
  REPS = 'reps',
  TIME = 'time',
}

/**
 * One Set of a single exercise, with associated Data
 */
export interface Set {
  weight?: number;
  weightUnits?: 'kg' | 'lb';
  reps?: number;
  time?: number;
}

/**
 * One Exercise, with sets
 */
export interface Exercise {
  templateId: string;
  sets: Set[];
}

/**
 * A collection of exercises completed at one time
 */
export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}
