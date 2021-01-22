import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  ExerciseSet,
  ExerciseSetData,
  ExerciseSetDataV1,
} from './exercise-set';
import { ExerciseType } from './exercise-type';

export const EXERCISE_TYPE = 'exerciseType';
export const EXERCISE_TYPE_ID = 'typeId';
export const SETS = 'sets';

/**
 * One exercise, with sets
 */
export class Exercise {
  public readonly [EXERCISE_TYPE]: ExerciseType;
  public readonly [SETS]: ExerciseSet[] = [];
  public readonly data: ExerciseData;

  constructor(sets: ExerciseSetData[], type: ExerciseType) {
    this[EXERCISE_TYPE] = type;
    this[SETS] = sets.map((data) => new ExerciseSet(data));

    this.data = {
      [SETS]: sets,
      [EXERCISE_TYPE_ID]: type.id,
    };
  }

  static fromForm(form: FormGroup): Exercise {
    const setForms = (form.get(SETS) as FormArray)?.controls || [];
    const sets = setForms.map(
      (set) => ExerciseSet.fromForm(set as FormGroup).data
    );
    const type: ExerciseType =
      form.get(EXERCISE_TYPE)?.value || ExerciseType.empty();

    return new Exercise(sets, type);
  }

  toForm(): FormGroup {
    return new FormGroup({
      [EXERCISE_TYPE]: new FormControl(this[EXERCISE_TYPE]),
      [SETS]: new FormArray(this[SETS].map((s) => s.toForm())),
    });
  }
}

/**
 * The most recent version of ExerciseData, used by Exercise
 */
export type ExerciseData = ExerciseDataV1;

/**
 * Version 1 of the serializable data held by a single Exercise instance
 */
export interface ExerciseDataV1 {
  [EXERCISE_TYPE_ID]: string;
  [SETS]: ExerciseSetDataV1[];
}
