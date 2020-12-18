import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddExerciseDialogComponent } from 'src/app/components/add-exercise-dialog/add-exercise-dialog.component';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import {
  Exercise,
  Workout,
  ExerciseSet,
  SetField,
} from 'src/app/types/workout';
import { v4 as uuidv4 } from 'uuid';

const EXERCISE_ARRAY_KEY = 'exercises';
const ADD_EXERCISE_DIALOG_WIDTH = '30ex';
export const SETS_ARRAY_KEY = 'sets';
@Component({
  selector: 'app-add-workout-page',
  templateUrl: './add-workout-page.component.html',
  styleUrls: ['./add-workout-page.component.scss'],
})
export class AddWorkoutPageComponent {
  /**
   * The exercise types corresponding to each exercise
   */
  types: string[] = [];

  /**
   * The Reactive Form containing the Workout data
   */
  form = new FormGroup({
    [EXERCISE_ARRAY_KEY]: new FormArray([]),
  });

  constructor(private rxdb: RxdbService, private dialog: MatDialog) {}

  /**
   * The FormArray containing forms for each exercise in the workout
   */
  get exerciseForms(): FormArray {
    return this.form.get(EXERCISE_ARRAY_KEY) as FormArray;
  }

  /**
   * Open a dialog and allow the user to select a new exercise to
   * add to the workout form.
   */
  addExercise(): void {
    const ref = this.dialog.open(AddExerciseDialogComponent, {
      width: ADD_EXERCISE_DIALOG_WIDTH,
    });

    ref.afterClosed().subscribe((exercise: ExerciseType) => {
      if (exercise) {
        this.types.push(exercise.id);
        this.exerciseForms.push(this.emptyExerciseForm());
      }
    });
  }

  /**
   * Save the current Workout as a new workout.
   */
  save(): void {
    this.rxdb.saveWorkout(this.toWorkout());
  }

  /**
   * Access the child form for the exercise at the given index.
   */
  getChildForm(index: number): FormGroup {
    return this.exerciseForms.at(index) as FormGroup;
  }

  /**
   * Convert the current backing form into a Workout;
   *
   * @param id the id of the new workout object, defaults to a new UUID.
   */
  private toWorkout(id = uuidv4()): Workout {
    const date = new Date().toUTCString();

    const exercises: Exercise[] = this.exerciseForms.controls.map(
      (exerciseGroup, i) => {
        const sets = (exerciseGroup.get(
          SETS_ARRAY_KEY
        ) as FormArray).controls.map((setGroup) =>
          this.toSet(setGroup as FormGroup)
        );

        return {
          type: this.types[i],
          sets,
        };
      }
    );

    return {
      date,
      name: 'unset', // TODO
      id,
      exercises,
    };
  }

  private toSet(form: FormGroup): ExerciseSet {
    const set: ExerciseSet = {};

    if (form.get(SetField.REPS)?.value) {
      set[SetField.REPS] = Number.parseInt(form.get(SetField.REPS)?.value);
    }

    if (form.get(SetField.WEIGHT)?.value) {
      set[SetField.WEIGHT] = Number.parseInt(form.get(SetField.WEIGHT)?.value);
    }

    if (form.get(SetField.DURATION)?.value) {
      set[SetField.DURATION] = Number.parseInt(
        form.get(SetField.DURATION)?.value
      );
    }

    return set;
  }

  private emptyExerciseForm(): FormGroup {
    return new FormGroup({
      [SETS_ARRAY_KEY]: new FormArray([]),
    });
  }
}
