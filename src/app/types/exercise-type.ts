import { v4 as uuidv4 } from 'uuid';
import { SetField } from './exercise-set';

/**
 * The muscle region used by an exercise.
 */
export enum ExerciseCategory {
  SHOULDERS = 'shoulders',
  TRICEPS = 'triceps',
  BICEPS = 'biceps',
  CHEST = 'chest',
  BACK = 'back',
  LEGS = 'legs',
  ABS = 'abs',
  CARDIO = 'cardio',
}

/**
 * All the available exercise categories
 */
export const exerciseCategories = [
  ExerciseCategory.SHOULDERS,
  ExerciseCategory.TRICEPS,
  ExerciseCategory.BICEPS,
  ExerciseCategory.CHEST,
  ExerciseCategory.BACK,
  ExerciseCategory.LEGS,
  ExerciseCategory.ABS,
  ExerciseCategory.CARDIO,
];

/**
 * Format an ExerciseCategory to be displayed to the user.
 *
 * @param category the category to format
 */
export function fmtDisplayExerciseCategory(category: ExerciseCategory): string {
  switch (category) {
    case ExerciseCategory.SHOULDERS:
      return 'Shoulders';
    case ExerciseCategory.TRICEPS:
      return 'Triceps';
    case ExerciseCategory.BICEPS:
      return 'Biceps';
    case ExerciseCategory.CHEST:
      return 'Chest';
    case ExerciseCategory.BACK:
      return 'Back';
    case ExerciseCategory.LEGS:
      return 'Legs';
    case ExerciseCategory.ABS:
      return 'Abs';
    case ExerciseCategory.CARDIO:
      return 'Cardio';
  }
}

/**
 * A type of exercise, describing the exercise name and the fields within each set
 */
export interface ExerciseType {
  id: string;
  name: string;
  fields: SetField[];
  categories: ExerciseCategory[];
}

/**
 * Returns a new, generated, empty Exercise type
 */
export function emptyExerciseType(): ExerciseType {
  return {
    id: uuidv4(),
    name: '',
    fields: [],
    categories: [],
  };
}
