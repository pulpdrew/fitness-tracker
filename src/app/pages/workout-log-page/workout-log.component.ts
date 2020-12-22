import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORKOUT_ROUTE } from 'src/app/constants';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import { Exercise, Workout } from 'src/app/types/workout';

interface WorkoutDisplay extends Workout {
  exerciseDisplays: ExerciseDisplay[];
}

interface ExerciseDisplay extends Exercise {
  name: string;
}
@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.scss'],
})
export class WorkoutLogPageComponent {
  WORKOUT_ROUTE = '/' + WORKOUT_ROUTE;

  workouts$: Observable<WorkoutDisplay[]> = combineLatest([
    this.rxdb.workouts$,
    this.rxdb.exerciseTypes$,
  ]).pipe(
    map(([workouts, exercises]) =>
      workouts.map((w) => this.formatWorkout(w, exercises))
    )
  );

  constructor(private rxdb: RxdbService) {}

  private formatWorkout(
    workout: Workout,
    types: ExerciseType[]
  ): WorkoutDisplay {
    return {
      exerciseDisplays: workout.exercises.map((e) =>
        this.formatExercise(e, types)
      ),
      ...workout,
    };
  }

  private formatExercise(
    exercise: Exercise,
    types: ExerciseType[]
  ): ExerciseDisplay {
    const name =
      types.find((t) => t.id === exercise.type)?.name || 'Unknown Exercise';

    return {
      name,
      ...exercise,
    };
  }
}
