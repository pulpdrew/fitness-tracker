import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AddExerciseDialogComponent } from 'src/app/components/add-exercise-dialog/add-exercise-dialog.component';
import {
  EXERCISE_ARRAY_KEY,
  ADD_EXERCISE_DIALOG_WIDTH,
} from 'src/app/constants';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import {
  Workout,
  formToWorkout,
  emptyExerciseForm,
  workoutToForm,
  getDefaultWorkoutName,
} from 'src/app/types/workout';

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
    date: new Date().toUTCString(),
    exercises: [],
    name: getDefaultWorkoutName(),
    id: '',
  });

  id$: Observable<string> = this.route.params.pipe(
    map((params) => params['id'])
  );

  preexistingWorkout$: Observable<Workout | undefined> = combineLatest([
    this.id$,
    this.rxdb.workouts$,
  ]).pipe(map(([id, workouts]) => workouts.find((w) => w.id === id)));

  constructor(
    private rxdb: RxdbService,
    private dialog: MatDialog,
    private route: ActivatedRoute
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
      if (exercise) this.exerciseForms.push(emptyExerciseForm(exercise.id));
    });
  }

  /**
   * Save the current Workout.
   */
  save(): void {
    this.id$.pipe(first()).subscribe((id) => {
      this.rxdb.saveWorkout(formToWorkout(this.form, id));
    });
  }

  /**
   * Access the child form for the exercise at the given index.
   */
  getChildForm(index: number): FormGroup {
    return this.exerciseForms.at(index) as FormGroup;
  }
}