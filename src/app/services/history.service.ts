import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import { ExerciseType } from '../types/exercise-type';
import { ExerciseSet, Workout } from '../types/workout';

export interface HistoryEntry {
  workoutID: string;
  workoutDate: Date;
  type: ExerciseType;
  sets: ExerciseSet[];
}

export type History = Map<string, HistoryEntry[]>;

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  /**
   * An observable map from exercise type id --> a chronological history
   * of that exercise, grouped by the workout in which they were performed.
   */
  public readonly history$: Observable<History>;

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
    history: History
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
  ): History {
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
        .filter((e) => e.type.id === type.id)
        .flatMap((e) => e.sets);

      if (sets.length > 0) {
        datedSets.push({
          sets,
          type,
          workoutDate: workout.date,
          workoutID: workout.id,
        });
      }
    }

    return datedSets;
  }
}
