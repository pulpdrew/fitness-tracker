import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import { EXERCISE_TYPE } from '../types/exercise';
import { ExerciseSet } from '../types/exercise-set';
import { ExerciseType } from '../types/exercise-type';
import { Workout } from '../types/workout';

export class HistoryEntry {
  constructor(
    public readonly workoutID: string,
    public readonly workoutDate: Date,
    public readonly type: ExerciseType,
    public readonly sets: ExerciseSet[]
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  /**
   * An observable map from exercise type id --> a chronological history
   * of that exercise, grouped by the workout in which they were performed.
   */
  public readonly history$: Observable<Map<string, HistoryEntry[]>>;

  /**
   * An observable map from exercise type id --> the sets of that exercise
   * performed during the most recent workout containing that exercise.
   */
  public readonly previous$: Observable<Map<string, HistoryEntry | undefined>>;

  constructor(@Inject(DATA_STORE) private readonly data: DataStore) {
    this.history$ = combineLatest([
      this.data.exerciseTypes$,
      this.data.workouts$,
    ]).pipe(map(([types, workouts]) => this.buildHistory(types, workouts)));

    this.previous$ = this.history$.pipe(map(this.buildPrevious));
  }

  private buildPrevious(
    history: Map<string, HistoryEntry[]>
  ): Map<string, HistoryEntry | undefined> {
    const previous = new Map<string, HistoryEntry | undefined>();
    for (const [id, datedSets] of history.entries()) {
      previous.set(
        id,
        datedSets.length > 0 ? datedSets[datedSets.length - 1] : undefined
      );
    }
    return previous;
  }

  private buildHistory(
    types: Map<string, ExerciseType>,
    workouts: Workout[]
  ): Map<string, HistoryEntry[]> {
    const history = new Map<string, HistoryEntry[]>();
    for (const type of types.values()) {
      const sets: HistoryEntry[] = this.getDatedSets(type, workouts);
      history.set(type.id, sets);
    }
    return history;
  }

  private getDatedSets(
    type: ExerciseType,
    workouts: Workout[]
  ): HistoryEntry[] {
    const datedSets: HistoryEntry[] = [];

    for (const workout of workouts) {
      const sets = workout.exercises
        .filter((e) => e[EXERCISE_TYPE].id === type.id)
        .flatMap((e) => e.sets);

      if (sets.length > 0) {
        datedSets.push(new HistoryEntry(workout.id, workout.date, type, sets));
      }
    }

    return datedSets;
  }
}
