import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddExerciseDialogComponent } from 'src/app/components/add-exercise-dialog/add-exercise-dialog.component';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseTemplate } from 'src/app/types/exercise-template';
import { Exercise, Workout } from 'src/app/types/workout';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-workout-page',
  templateUrl: './add-workout-page.component.html',
  styleUrls: ['./add-workout-page.component.scss'],
})
export class AddWorkoutPageComponent {
  exercises: Exercise[] = [];

  constructor(private rxdb: RxdbService, private dialog: MatDialog) {}

  addExercise(): void {
    const ref = this.dialog.open(AddExerciseDialogComponent, {
      width: '30ex',
    });

    ref.afterClosed().subscribe((exercise: ExerciseTemplate) => {
      if (exercise)
        this.exercises.push({
          sets: [],
          templateId: exercise.id,
        });
    });
  }

  save(): void {
    const workout: Workout = {
      date: new Date().toUTCString(),
      exercises: this.exercises,
      id: uuidv4(),
    };

    this.rxdb.saveWorkout(workout);
  }

  updateExercise(index: number, updated: Exercise): void {
    this.exercises[index] = updated;
  }
}
