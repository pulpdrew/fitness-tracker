import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddExerciseDialogComponent } from 'src/app/components/add-exercise-dialog/add-exercise-dialog.component';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseTemplate } from 'src/app/types/exercise-template';
import { Exercise, Workout, Set, SetField } from 'src/app/types/workout';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-workout-page',
  templateUrl: './add-workout-page.component.html',
  styleUrls: ['./add-workout-page.component.scss'],
})
export class AddWorkoutPageComponent {
  templateIds: string[] = [];
  form = new FormGroup({
    exercises: new FormArray([]),
  });

  constructor(private rxdb: RxdbService, private dialog: MatDialog) {}

  get exerciseForms(): FormArray {
    return this.form.get('exercises') as FormArray;
  }

  addExercise(): void {
    const ref = this.dialog.open(AddExerciseDialogComponent, {
      width: '30ex',
    });

    ref.afterClosed().subscribe((exercise: ExerciseTemplate) => {
      if (exercise) this.templateIds.push(exercise.id);

      this.exerciseForms.push(this.emptyExerciseForm());
    });
  }

  save(): void {
    this.rxdb.saveWorkout(this.toWorkout());
  }

  getChildForm(index: number): FormGroup {
    return this.exerciseForms.at(index) as FormGroup;
  }

  private toWorkout(): Workout {
    const date = new Date().toUTCString();
    const id = uuidv4();

    const exercises: Exercise[] = this.exerciseForms.controls.map(
      (exerciseGroup, i) => {
        const sets = (exerciseGroup.get(
          'sets'
        ) as FormArray).controls.map((setGroup) =>
          this.toSet(setGroup as FormGroup)
        );

        return {
          templateId: this.templateIds[i],
          sets,
        };
      }
    );

    return {
      date,
      id,
      exercises,
    };
  }

  private toSet(form: FormGroup): Set {
    const set: Set = {};

    if (form.get(SetField.REPS)?.value) {
      set[SetField.REPS] = Number.parseInt(form.get(SetField.REPS)?.value);
    }

    if (form.get(SetField.WEIGHT)?.value) {
      set[SetField.WEIGHT] = Number.parseInt(form.get(SetField.WEIGHT)?.value);
    }

    if (form.get(SetField.TIME)?.value) {
      set[SetField.TIME] = Number.parseInt(form.get(SetField.TIME)?.value);
    }

    return set;
  }

  private emptyExerciseForm(): FormGroup {
    return new FormGroup({
      sets: new FormArray([]),
    });
  }
}
