import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORKOUT_ROUTE } from 'src/app/constants';
import { DisplayCategoryPipe } from 'src/app/pipes/display-categories.pipe';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseCategory, ExerciseType } from 'src/app/types/exercise-type';
import { Exercise, Workout } from 'src/app/types/workout';

interface CategoryCount {
  name: string;
  value: number;
}
interface WorkoutDisplay extends Workout {
  exerciseDisplays: ExerciseDisplay[];
  link: string;
  categoryData: CategoryCount[];
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

  constructor(
    private rxdb: RxdbService,
    private displayCategory: DisplayCategoryPipe
  ) {}

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
      categoryData: this.countCategories(workout, types),
      ...workout,
    };
  }

  private countCategories(
    workout: Workout,
    types: ExerciseType[]
  ): CategoryCount[] {
    const counts = new Map<ExerciseCategory, number>();
    for (const exercise of workout.exercises) {
      const categories =
        types.find((t) => t.id === exercise.type)?.categories || [];
      for (const category of categories) {
        counts.set(category, (counts.get(category) || 0) + 1);
      }
    }

    return Array.from(counts.entries()).map(([category, count]) => ({
      name: this.displayCategory.transform(category),
      value: count,
    }));
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
