import { Component, Inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AddExerciseDialogComponent } from 'src/app/components/add-exercise-dialog/add-exercise-dialog.component';
import {
  EXERCISE_ARRAY_KEY,
  ADD_EXERCISE_DIALOG_WIDTH,
  WORKOUT_ROUTE,
  DATA_SOURCE_INJECTION_TOKEN,
} from 'src/app/constants';
import DataSource from 'src/app/types/data-source';
import { ExerciseType } from 'src/app/types/exercise-type';
import {
  Workout,
  formToWorkout,
  emptyExerciseForm,
  workoutToForm,
  getDefaultWorkoutName,
} from 'src/app/types/workout';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-edit-workout-page',
  templateUrl: './edit-workout-page.component.html',
  styleUrls: ['./edit-workout-page.component.scss'],
})
export class EditWorkoutPageComponent {
  /**
   * The Reactive Form containing the Workout data
   */
  form = workoutToForm({
    date: new Date(),
    exercises: [],
    name: getDefaultWorkoutName(),
    id: '',
  });

  /**
   * The ID of the workout being edited
   */
  id$: Observable<string> = this.route.params.pipe(
    map((params) => params['id'])
  );

  /**
   * The pre-existing workout with this id, if such a workout exists
   */
  preexistingWorkout$: Observable<Workout | undefined> = combineLatest([
    this.id$,
    this.data.workouts$,
  ]).pipe(map(([id, workouts]) => workouts.find((w) => w.id === id)));

  /**
   * Whether `this.id$` is the id of workout that exists in the database
   */
  isEditingExisting$: Observable<boolean> = this.preexistingWorkout$.pipe(
    map((w) => !!w)
  );

  constructor(
    @Inject(DATA_SOURCE_INJECTION_TOKEN) private data: DataSource,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.preexistingWorkout$.subscribe((workout) => {
      if (workout) this.form = workoutToForm(workout);
    });
  }

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
      if (exercise) this.exerciseForms.push(emptyExerciseForm(exercise));
    });
  }

  /**
   * Save the current Workout.
   */
  saveChanges(): void {
    this.id$.pipe(first()).subscribe((id) => {
      this.data
        .upsertWorkout(formToWorkout(this.form, id))
        .then(() => {
          this.snackBar.open('Saved!');
        })
        .catch(() => {
          this.snackBar.open('Failed to save. Try Again.');
        });
    });
  }

  /**
   * Save the current Workout as a copy with a new id.
   */
  saveAsNew(): void {
    const id = uuidv4();
    this.data
      .upsertWorkout(formToWorkout(this.form, id))
      .then(() => {
        this.snackBar.open('Saved!');
      })
      .catch(() => {
        this.snackBar.open('Failed to save. Try Again.');
      });
    this.router.navigate([WORKOUT_ROUTE, id]);
  }

  /**
   * Access the child form for the exercise at the given index.
   */
  getChildForm(index: number): FormGroup {
    return this.exerciseForms.at(index) as FormGroup;
  }

  /**
   * Move the exercise towards the beginning of the list of exercises
   */
  moveUp(index: number): void {
    if (index > 0 && index < this.exerciseForms.length) {
      const moved = this.exerciseForms.at(index);
      this.exerciseForms.removeAt(index);
      this.exerciseForms.insert(index - 1, moved);
    }
  }

  /**
   * Move the exercise towards the end of the list of exercises
   */
  moveDown(index: number): void {
    if (index >= 0 && index < this.exerciseForms.length - 1) {
      const moved = this.exerciseForms.at(index);
      this.exerciseForms.removeAt(index);
      this.exerciseForms.insert(index + 1, moved);
    }
  }

  /**
   * Remove the exercise from the list of exercises
   */
  remove(index: number): void {
    if (index >= 0 && index < this.exerciseForms.length) {
      this.exerciseForms.removeAt(index);
    }
  }
}
