import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORKOUT_ROUTE } from 'src/app/constants';
import DataStore, { DATA_STORE } from 'src/app/types/data-store';
import { EXERCISE_TYPE } from 'src/app/types/exercise';
import {
  DisplayCategoryPipe,
  ExerciseCategory,
} from 'src/app/types/exercise-type';
import { Workout } from 'src/app/types/workout';

interface CategoryCount {
  name: string;
  value: number;
}
interface WorkoutDisplay {
  workout: Workout;
  link: string;
  categoryData: CategoryCount[];
}

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.scss'],
})
export class WorkoutLogPageComponent {
  workouts$: Observable<WorkoutDisplay[]> = this.data.workouts$.pipe(
    map((workouts: Workout[]) =>
      workouts
        .map((w) => this.formatWorkout(w))
        .sort((a, b) => b.workout.date.getTime() - a.workout.date.getTime())
    )
  );

  constructor(
    @Inject(DATA_STORE) private data: DataStore,
    private displayCategory: DisplayCategoryPipe
  ) {}

  deleteWorkout(workout: Workout): void {
    this.data.deleteWorkout(workout);
  }

  async copyWorkout(workout: Workout): Promise<void> {
    await this.data.upsertWorkout(workout.copy());
  }

  private formatWorkout(workout: Workout): WorkoutDisplay {
    return {
      link: `/${WORKOUT_ROUTE}/${workout.id}`,
      categoryData: this.countCategories(workout),
      workout,
    };
  }

  private countCategories(workout: Workout): CategoryCount[] {
    const counts = new Map<ExerciseCategory, number>();
    for (const exercise of workout.exercises) {
      const categories = exercise[EXERCISE_TYPE]?.categories || [];
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
