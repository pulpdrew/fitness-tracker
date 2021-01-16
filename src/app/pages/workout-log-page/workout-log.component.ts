import { Component, Inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORKOUT_ROUTE } from 'src/app/constants';
import { DisplayCategoryPipe } from 'src/app/pipes/display-categories.pipe';
import DataStore, { DATA_STORE } from 'src/app/types/data-store';
import { ExerciseCategory, ExerciseType } from 'src/app/types/exercise-type';
import { Workout } from 'src/app/types/workout';
import { v4 as uuidv4 } from 'uuid';

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
    @Inject(DATA_STORE) private data: DataStore,
    private displayCategory: DisplayCategoryPipe
  ) {}

  deleteWorkout(workout: Workout): void {
    this.data.deleteWorkout(workout);
  }

  async copyWorkout(workout: Workout): Promise<void> {
    const copy: Workout = {
      ...workout,
      name: `Copy of ${workout.name}`,
      id: uuidv4(),
    };
    await this.data.upsertWorkout(copy);
  }

  private formatWorkout(
    workout: Workout,
    types: Map<string, ExerciseType>
  ): WorkoutDisplay {
    return {
      link: `/${WORKOUT_ROUTE}/${workout.id}`,
      categoryData: this.countCategories(workout, types),
      ...workout,
    };
  }

  private countCategories(
    workout: Workout,
    types: Map<string, ExerciseType>
  ): CategoryCount[] {
    const counts = new Map<ExerciseCategory, number>();
    for (const exercise of workout.exercises) {
      const categories = types.get(exercise.type.id)?.categories || [];
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
