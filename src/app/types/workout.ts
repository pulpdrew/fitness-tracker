import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  NAME_KEY,
  DATE_KEY,
  EXERCISE_ARRAY_KEY,
  SETS_ARRAY_KEY,
  EXERCISE_TYPE_ID_KEY,
} from '../constants';
import { v4 as uuidv4 } from 'uuid';

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

export function formToSet(form: FormGroup): ExerciseSet {
  const set: ExerciseSet = {};

  if (form.get(SetField.REPS)?.value) {
    set[SetField.REPS] = Number.parseInt(form.get(SetField.REPS)?.value);
  }

  if (form.get(SetField.WEIGHT)?.value) {
    set[SetField.WEIGHT] = Number.parseInt(form.get(SetField.WEIGHT)?.value);
  }

  if (form.get(SetField.WEIGHT_UNITS)?.value) {
    set[SetField.WEIGHT_UNITS] = form.get(SetField.WEIGHT_UNITS)?.value;
  }

  if (form.get(SetField.DURATION)?.value) {
    set[SetField.DURATION] = Number.parseInt(
      form.get(SetField.DURATION)?.value
    );
  }

  return set;
}

export function setToForm(set: ExerciseSet): FormGroup {
  return new FormGroup({
    [SetField.WEIGHT]: new FormControl(set[SetField.WEIGHT]),
    [SetField.WEIGHT_UNITS]: new FormControl(set[SetField.WEIGHT_UNITS]),
    [SetField.REPS]: new FormControl(set[SetField.REPS]),
    [SetField.DURATION]: new FormControl(set[SetField.DURATION]),
  });
}

export function emptySetForm(): FormGroup {
  return setToForm({});
}

export function copySetForm(form: FormGroup): FormGroup {
  return new FormGroup({
    [SetField.WEIGHT]: new FormControl(form.get(SetField.WEIGHT)?.value || ''),
    [SetField.WEIGHT_UNITS]: new FormControl(
      form.get(SetField.WEIGHT_UNITS)?.value || ''
    ),
    [SetField.REPS]: new FormControl(form.get(SetField.REPS)?.value || ''),
    [SetField.DURATION]: new FormControl(
      form.get(SetField.DURATION)?.value || ''
    ),
  });
}

/**
 * One exercise, with sets
 */
export interface Exercise {
  type: string;
  sets: ExerciseSet[];
}

export function formToExercise(form: FormGroup): Exercise {
  const setForms = (form.get(SETS_ARRAY_KEY) as FormArray)?.controls || [];
  const sets = setForms.map((set) => formToSet(set as FormGroup));
  const type = form.get(EXERCISE_TYPE_ID_KEY)?.value || '';

  return {
    type,
    sets,
  };
}

export function emptyExerciseForm(type: string): FormGroup {
  return exerciseToForm({
    sets: [],
    type,
  });
}

export function exerciseToForm(exercise: Exercise): FormGroup {
  return new FormGroup({
    [EXERCISE_TYPE_ID_KEY]: new FormControl(exercise.type),
    [SETS_ARRAY_KEY]: new FormArray(exercise.sets.map(setToForm)),
  });
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

export function workoutToForm(workout: Workout): FormGroup {
  return new FormGroup({
    [NAME_KEY]: new FormControl(workout.name),
    [DATE_KEY]: new FormControl(new Date(workout.date)),
    [EXERCISE_ARRAY_KEY]: new FormArray(workout.exercises.map(exerciseToForm)),
  });
}

/**
 * Convert the given FormGroup into a Workout;
 *
 * @param id the id of the new workout object, defaults to a new UUID.
 */
export function formToWorkout(form: FormGroup, id = uuidv4()): Workout {
  const date =
    form.get(DATE_KEY)?.value.toUTCString() || new Date().toUTCString();
  const name = form.get(NAME_KEY)?.value || getDefaultWorkoutName(date);

  const exerciseForms =
    (form.get(EXERCISE_ARRAY_KEY) as FormArray).controls || [];
  const exercises: Exercise[] = exerciseForms.map((ex) =>
    formToExercise(ex as FormGroup)
  );

  return {
    id,
    date,
    name,
    exercises,
  };
}

export function getDefaultWorkoutName(date: Date = new Date()): string {
  return `Workout on ${date.toLocaleDateString()}`;
}
