/**
 * The fields that can be stored in an ExerciseSet
 */
export enum SetField {
  WEIGHT = 'weight',
  WEIGHT_UNITS = 'weightUnits',
  REPS = 'reps',
  DURATION = 'duration',
}

/**
 * Format a SetField for display.
 *
 * @param field the field to format.
 * @returns the formatted display string
 */
export function fmtDisplaySetField(field: SetField): string {
  switch (field) {
    case SetField.REPS:
      return 'Reps';
    case SetField.WEIGHT:
      return 'Weight';
    case SetField.WEIGHT_UNITS:
      return 'Weight Units';
    case SetField.DURATION:
      return 'Duration';
  }
}

/**
 * A list of all the available SetFields
 */
export const setFields: SetField[] = [
  SetField.REPS,
  SetField.DURATION,
  SetField.WEIGHT,
  SetField.WEIGHT_UNITS,
];

/**
 * The available units of weight
 */
export enum WeightUnit {
  KG = 'kg',
  LB = 'lb',
}

/**
 * A list of all the available WeightUnits
 */
export const weightUnits: WeightUnit[] = [WeightUnit.KG, WeightUnit.LB];

/**
 * The default Weight Unit
 */
export const DEFAULT_WEIGHT_UNIT: WeightUnit = WeightUnit.KG;

/**
 * One Set of a single exercise, with associated data fields
 */
export interface ExerciseSet {
  weight?: number;
  weightUnits?: 'kg' | 'lb';
  reps?: number;
  duration?: number;
}

/**
 * One exercise, with sets
 */
export interface Exercise {
  type: string;
  sets: ExerciseSet[];
}

/**
 * A collection of exercises completed at one time
 */
export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
}
