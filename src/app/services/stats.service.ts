import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import { ExerciseType } from '../types/exercise-type';
import { WeightUnit } from '../types/workout';
import { HistoryEntry, HistoryService } from './history.service';

export interface ExerciseStats {
  readonly type: ExerciseType;
  readonly workouts: WorkoutStats[];
  readonly maxWeight?: number;
  readonly weightUnits?: WeightUnit;
  readonly maxReps?: number;
  readonly maxDuration?: number;
}

export interface WorkoutStats {
  readonly workoutId: string;
  readonly workoutDate: Date;
  readonly maxWeight?: number;
  readonly totalWeight?: number;
  readonly weightUnits?: WeightUnit;
  readonly maxReps?: number;
  readonly totalReps?: number;
  readonly maxDuration?: number;
  readonly totalDuration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  public readonly stats$: Observable<Map<string, ExerciseStats>>;

  constructor(
    @Inject(DATA_STORE) private readonly data: DataStore,
    private readonly history: HistoryService
  ) {
    this.stats$ = combineLatest([
      this.history.history$,
      this.data.exerciseTypes$,
    ]).pipe(map(([history, types]) => this.buildWorkoutStats(history, types)));
  }

  private buildWorkoutStats(
    history: Map<string, HistoryEntry[]>,
    types: Map<string, ExerciseType>
  ): Map<string, ExerciseStats> {
    const exerciseStats = new Map<string, ExerciseStats>();

    for (const [id, entries] of history.entries()) {
      const workouts = entries.map((entry) => this.toWorkoutStats(entry));

      const weightUnits: WeightUnit | undefined =
        workouts.filter((w) => !!w.weightUnits)[0]?.weightUnits || undefined;

      const weights = workouts
        .filter((stats) => !!stats.maxWeight && !!stats.weightUnits)
        .map((stats) =>
          this.ensureUnit(stats.maxWeight!, stats.weightUnits!, weightUnits!)
        );

      const stats: ExerciseStats = {
        type: types.get(id)!,
        workouts,
        maxDuration:
          this.max(...workouts.map((wo) => wo.maxDuration)) || undefined,
        maxReps: this.max(...workouts.map((wo) => wo.maxReps)) || undefined,
        maxWeight: this.max(...weights) || undefined,
        weightUnits,
      };

      exerciseStats.set(id, stats);
    }

    return exerciseStats;
  }

  private toWorkoutStats(historyEntry: HistoryEntry): WorkoutStats {
    const weightUnits: WeightUnit | undefined =
      historyEntry.sets.filter((s) => !!s.weight && !!s.weightUnits)[0]
        ?.weightUnits || undefined;

    const weights = historyEntry.sets
      .filter((set) => set.weight && set.weightUnits)
      .map((set) =>
        this.ensureUnit(set.weight!, set.weightUnits!, weightUnits!)
      );

    const volumes = historyEntry.sets
      .filter((set) => set.weight && set.weightUnits)
      .map(
        (set) =>
          (set.reps || 1) *
          this.ensureUnit(set.weight!, set.weightUnits!, weightUnits!)
      );

    return {
      workoutDate: historyEntry.workoutDate,
      workoutId: historyEntry.workoutID,
      maxDuration:
        this.max(...historyEntry.sets.map((set) => set.duration)) || undefined,
      totalDuration:
        this.sum(...historyEntry.sets.map((set) => set.duration)) || undefined,
      maxReps:
        this.max(...historyEntry.sets.map((set) => set.reps)) || undefined,
      totalReps:
        this.sum(...historyEntry.sets.map((set) => set.reps)) || undefined,
      maxWeight: this.max(...weights) || undefined,
      totalWeight: this.sum(...volumes) || undefined,
      weightUnits,
    };
  }

  private sum(...numbers: (number | undefined)[]): number {
    return numbers
      .filter((n) => !!n && n > 0)
      .reduce((sum: number, next) => sum + next!, 0);
  }

  private max(...numbers: (number | undefined)[]): number {
    return Math.max(...(numbers.filter((n) => !!n && n > 0) as number[])) || 0;
  }

  private ensureUnit(
    weight: number,
    currentUnit: WeightUnit,
    desiredUnit: WeightUnit
  ): number {
    if (currentUnit == desiredUnit) {
      return weight;
    } else if (currentUnit == WeightUnit.KG) {
      return this.toLbs(weight);
    } else {
      return this.toKgs(weight);
    }
  }

  private toKgs(lbs: number): number {
    return lbs * 0.45455;
  }

  private toLbs(kgs: number): number {
    return kgs * 2.2;
  }
}
