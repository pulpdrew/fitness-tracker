import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import {
  Exercise,
  ExerciseDataV1,
  EXERCISE_TYPE,
  EXERCISE_TYPE_ID,
  SETS,
} from './exercise';
import { ExerciseType } from './exercise-type';

export const NAME = 'name';
export const DATE = 'date';
export const ID = 'id';
export const EXERCISES = 'exercises';

/**
 * A collection of exercises completed at one time
 */
export class Workout {
  public readonly [ID]: string;
  public readonly [NAME]: string;
  public readonly [DATE]: Date;
  public readonly [EXERCISES]: Exercise[];

  constructor(
    public readonly data: WorkoutData,
    types: Map<string, ExerciseType>
  ) {
    this[ID] = data[ID];
    this[DATE] = new Date(data[DATE]);
    this[NAME] = data[NAME];
    this[EXERCISES] = data[EXERCISES].map(
      (e) =>
        new Exercise(
          e[SETS],
          types.get(e[EXERCISE_TYPE_ID]) || ExerciseType.empty()
        )
    );
  }

  copy(): Workout {
    const types = new Map<string, ExerciseType>(
      this[EXERCISES].map((e) => [e[EXERCISE_TYPE].id, e[EXERCISE_TYPE]])
    );
    return new Workout(
      {
        ...this.data,
        id: uuidv4(),
        name: `Copy of ${this[NAME]}`,
      },
      types
    );
  }

  toForm(): FormGroup {
    return new FormGroup({
      [NAME]: new FormControl(this[NAME]),
      [DATE]: new FormControl(this[DATE]),
      [EXERCISES]: new FormArray(this[EXERCISES].map((e) => e.toForm())),
    });
  }

  static fromForm(
    form: FormGroup,
    types: Map<string, ExerciseType>,
    id: string = uuidv4()
  ): Workout {
    const date: Date = form.get(DATE)?.value || new Date();
    const name = form.get(NAME)?.value || Workout.getDefaultName(date);

    const exerciseForms = (form.get(EXERCISES) as FormArray).controls || [];
    const exercises: ExerciseDataV1[] = exerciseForms.map(
      (f) => Exercise.fromForm(f as FormGroup).data
    );

    return new Workout(
      {
        date: date.toISOString(),
        id,
        name,
        exercises,
      },
      types
    );
  }

  static getDefaultName(date: Date = new Date()): string {
    return `Workout on ${date.toLocaleDateString()}`;
  }

  static empty(): Workout {
    return new Workout(
      {
        date: new Date().toISOString(),
        exercises: [],
        name: Workout.getDefaultName(new Date()),
        id: '',
      },
      new Map()
    );
  }

  static chronological(a: Workout, b: Workout): number {
    return a[DATE].getTime() - b[DATE].getTime();
  }
}

/**
 * The most recent version of WorkoutData, used by Workout
 */
export type WorkoutData = WorkoutDataV1;

/**
 * Version 1 of the serializable data held by a single Workout
 */
export interface WorkoutDataV1 {
  [ID]: string;
  [NAME]: string;
  [DATE]: string;
  [EXERCISES]: ExerciseDataV1[];
}
