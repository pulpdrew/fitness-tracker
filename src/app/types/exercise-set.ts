import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Duration } from './duration';
import { WeightUnit } from './weight';

export const DURATION = 'duration';
export const REPS = 'reps';
export const WEIGHT = 'weight';
export const WEIGHT_UNITS = 'weightUnits';

/**
 * One Set of a single exercise, with associated data fields
 */
export class ExerciseSet {
  public [WEIGHT]?: number;
  public [WEIGHT_UNITS]?: WeightUnit;
  public [DURATION]?: Duration;
  public [REPS]?: number;

  constructor(public readonly data: ExerciseSetData) {
    if (data[DURATION]) this[DURATION] = new Duration(data[DURATION]!);
    if (data[REPS]) this[REPS] = data[REPS];
    if (data[WEIGHT]) {
      this[WEIGHT] = data[WEIGHT];
      this[WEIGHT_UNITS] = data[WEIGHT_UNITS];
    }
  }

  static fromForm(form: FormGroup): ExerciseSet {
    const data: ExerciseSetData = {};

    if (form.get(REPS)?.value) {
      data[REPS] = Number.parseInt(form.get(REPS)?.value);
    }

    if (form.get(WEIGHT)?.value) {
      data[WEIGHT] = Number.parseInt(form.get(WEIGHT)?.value);
    }

    if (form.get(WEIGHT_UNITS)?.value) {
      data[WEIGHT_UNITS] = form.get(WEIGHT_UNITS)?.value;
    }

    if (form.get(DURATION)?.value) {
      data[DURATION] = Duration.parse(form.get(DURATION)?.value).totalSeconds;
    }

    return new ExerciseSet(data);
  }

  toForm(): FormGroup {
    return new FormGroup({
      [WEIGHT]: new FormControl(this[WEIGHT]),
      [WEIGHT_UNITS]: new FormControl(this[WEIGHT_UNITS]),
      [REPS]: new FormControl(this[REPS]),
      [DURATION]: new FormControl(
        (this[DURATION] || new Duration(0)).toString(),
        [Validators.pattern(/^(\d?\d:)?(\d?\d:)?\d?\d$/)]
      ),
    });
  }

  toString(): string {
    let display = '';

    if (this[REPS]) {
      display = `${this[REPS]}`;
    }

    if (this[REPS] && !this[WEIGHT] && !this[DURATION]) {
      display += ' reps';
    } else if (this[REPS]) {
      display += ' x ';
    }

    if (this[WEIGHT]) {
      display += `${this[WEIGHT]}${this[WEIGHT_UNITS]}`;
    }

    if (this[DURATION]) {
      const duration = this[DURATION]!.toString();
      if (this[WEIGHT]) {
        display += `for ${duration}`;
      } else {
        display += `${duration}`;
      }
    }

    return display || 'Empty Set';
  }
}

/**
 * The most recent version of ExerciseSetData, used by ExerciseSet
 */
export type ExerciseSetData = ExerciseSetDataV1;

/**
 * A field that can be recorded in an ExerciseSet
 */
export type SetField = keyof ExerciseSetData;

/**
 * A list of the fields that can be recorded in an ExerciseSet.
 */
export const setFields: SetField[] = [DURATION, REPS, WEIGHT, WEIGHT_UNITS];

/**
 * Version 1 of the serializable data held by a single ExerciseSet.
 */
export interface ExerciseSetDataV1 {
  [WEIGHT]?: number;
  [WEIGHT_UNITS]?: WeightUnit;
  [REPS]?: number;
  [DURATION]?: number;
}

export function fmtDisplaySetField(field: SetField): string {
  switch (field) {
    case DURATION:
      return 'Duration';
    case REPS:
      return 'Reps';
    case WEIGHT:
      return 'Weight';
    case WEIGHT_UNITS:
      return 'Weight Units';
  }
}
