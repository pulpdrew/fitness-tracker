import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORKOUT_ROUTE } from 'src/app/constants';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import { Exercise, Workout } from 'src/app/types/workout';

interface WorkoutDisplay extends Workout {
  exerciseDisplays: ExerciseDisplay[];
  link: string;
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
  workouts$: Observable<WorkoutDisplay[]> = combineLatest([
    this.rxdb.workouts$,
    this.rxdb.exerciseTypes$,
  ]).pipe(
    map(([workouts, exercises]) =>
      workouts
        .map((w) => this.formatWorkout(w, exercises))
        .sort((a, b) => a.date.localeCompare(b.date))
    )
  );

  constructor(private rxdb: RxdbService) {}

  deleteWorkout(workout: Workout): void {
    this.rxdb.deleteWorkout(workout);
  }

  private formatWorkout(
    workout: Workout,
    types: ExerciseType[]
  ): WorkoutDisplay {
    return {
      exerciseDisplays: workout.exercises.map((e) =>
        this.formatExercise(e, types)
      ),
      link: `/${WORKOUT_ROUTE}/${workout.id}`,
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
