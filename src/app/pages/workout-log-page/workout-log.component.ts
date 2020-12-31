import { Component, Inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATA_SOURCE_INJECTION_TOKEN, WORKOUT_ROUTE } from 'src/app/constants';
import { DisplayCategoryPipe } from 'src/app/pipes/display-categories.pipe';
import DataSource from 'src/app/types/data-source';
import { ExerciseCategory, ExerciseType } from 'src/app/types/exercise-type';
import { Workout } from 'src/app/types/workout';

interface CategoryCount {
  name: string;
  value: number;
}
interface WorkoutDisplay extends Workout {
  link: string;
  categoryData: CategoryCount[];
}

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.scss'],
})
export class WorkoutLogPageComponent {
  workouts$: Observable<WorkoutDisplay[]> = combineLatest([
    this.data.workouts$,
    this.data.exerciseTypes$,
  ]).pipe(
    map(([workouts, exercises]) =>
      workouts
        .map((w) => this.formatWorkout(w, exercises))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    )
  );

  constructor(
    @Inject(DATA_SOURCE_INJECTION_TOKEN) private data: DataSource,
    private displayCategory: DisplayCategoryPipe
  ) {}

  deleteWorkout(workout: Workout): void {
    this.data.deleteWorkout(workout);
  }

  private formatWorkout(
    workout: Workout,
    types: ExerciseType[]
  ): WorkoutDisplay {
    return {
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
        types.find((t) => t.id === exercise.type.id)?.categories || [];
      for (const category of categories) {
        counts.set(category, (counts.get(category) || 0) + 1);
      }
    }

    return Array.from(counts.entries()).map(([category, count]) => ({
      name: this.displayCategory.transform(category),
      value: count,
    }));
  }
}
