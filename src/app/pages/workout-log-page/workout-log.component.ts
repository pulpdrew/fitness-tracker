import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseTemplate } from 'src/app/types/exercise-template';
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
  workouts$: Observable<WorkoutDisplay[]> = combineLatest([
    this.rxdb.workouts$,
    this.rxdb.exercises$,
  ]).pipe(
    map(([workouts, exercises]) =>
      workouts.map((w) => this.formatWorkout(w, exercises))
    ),
    tap(console.log)
  );

  constructor(private rxdb: RxdbService) {}

  private formatWorkout(
    workout: Workout,
    templates: ExerciseTemplate[]
  ): WorkoutDisplay {
    return {
      exerciseDisplays: workout.exercises.map((e) =>
        this.formatExercise(e, templates)
      ),
      ...workout,
    };
  }

  private formatExercise(
    exercise: Exercise,
    templates: ExerciseTemplate[]
  ): ExerciseDisplay {
    const name =
      templates.find((t) => t.id === exercise.templateId)?.name ||
      'Unknown Exercise';

    return {
      name,
      ...exercise,
    };
  }
}
