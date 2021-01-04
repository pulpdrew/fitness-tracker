import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATA_SOURCE_INJECTION_TOKEN } from '../constants';
import DataSource from '../types/data-source';
import { emptyExerciseType, ExerciseType } from '../types/exercise-type';
import { ExerciseSet, WeightUnit, Workout } from '../types/workout';
import { SettingsService } from './settings.service';

export interface ExerciseStats {
  type: ExerciseType;
  history: WorkoutSummary[];
  lastSet?: ExerciseSet;
  maxWeight: number;
  maxWeightUnits: WeightUnit;
  maxReps: number;
  maxDuration: number;
}

export function emptyExerciseStats(
  type: ExerciseType = emptyExerciseType()
): ExerciseStats {
  return {
    type,
    history: [],
    maxWeight: 0,
    maxWeightUnits: WeightUnit.KG,
    maxReps: 0,
    maxDuration: 0,
  };
}

export interface WorkoutSummary {
  workoutId: string;
  date: Date;
  sets: ExerciseSet[];
  totalWeight: number;
  totalReps: number;
  totalDuration: number;
  maxWeight: number;
  maxReps: number;
  maxDuration: number;
  weightUnits: WeightUnit;
}

@Injectable({
  providedIn: 'root',
})
export class ExerciseStatsService {
  stats$: Observable<Map<string, ExerciseStats>> = combineLatest([
    this.data.workouts$,
    this.settings.defaultWeightUnit$,
  ]).pipe(map(([workouts, unit]) => this.calculateStats(workouts, unit)));

  constructor(
    @Inject(DATA_SOURCE_INJECTION_TOKEN) private data: DataSource,
    private settings: SettingsService
  ) {}

  /**
   * Maps each ExerciseType id to a list of stats for that exercise, by date.
   *
   * @param workouts the workouts containing the exercises.
   */
  private calculateStats(
    workouts: Workout[],
    weightUnits: WeightUnit
  ): Map<string, ExerciseStats> {
    // Get the all of the exercise types that have been completed
    const types = workouts
      .flatMap((exercise) => exercise.exercises)
      .map((exercise) => exercise.type)
      .reduce((uniq, type) => uniq.add(type), new Set<ExerciseType>());

    const stats = new Map<string, ExerciseStats>();
    for (const type of types) {
      const workoutSummaries = workouts.map((w) =>
        this.summarizeWorkout(w, type.id, weightUnits)
      );

      const lastWorkout = workoutSummaries[workoutSummaries.length - 1];
      const lastSet = lastWorkout.sets[lastWorkout.sets.length];

      stats.set(type.id, {
        type,
        history: workoutSummaries,
        lastSet,
        maxDuration: Math.max(...workoutSummaries.map((s) => s.maxDuration)),
        maxReps: Math.max(...workoutSummaries.map((s) => s.maxReps)),
        maxWeight: Math.max(...workoutSummaries.map((s) => s.maxWeight)),
        maxWeightUnits: weightUnits,
      });
    }

    return stats;
  }

  private summarizeWorkout(
    workout: Workout,
    exerciseTypeId: string,
    weightUnits: WeightUnit
  ): WorkoutSummary {
    const sets = workout.exercises
      .filter((e) => e.type.id === exerciseTypeId)
      .flatMap((e) => e.sets);
    return {
      sets,
      workoutId: workout.id,
      date: workout.date,
      weightUnits,
      maxDuration: Math.max(...sets.map((s) => s.duration || 0), 0),
      maxReps: Math.max(...sets.map((s) => s.reps || 0), 0),
      maxWeight: Math.max(
        ...sets
          .filter((s) => !!s.weight)
          .map((s) => this.ensureUnit(s.weight!, s.weightUnits!, weightUnits)),
        0
      ),
      totalDuration: sets
        .map((s) => s.duration || 0)
        .reduce((sum, next) => sum + next, 0),
      totalReps: sets
        .map((s) => s.reps || 0)
        .reduce((sum, next) => sum + next, 0),
      totalWeight: sets
        .filter((s) => !!s.weight)
        .map(
          (s) =>
            this.ensureUnit(s.weight!, s.weightUnits!, weightUnits) *
            (s.reps || 1)
        )
        .reduce((sum, next) => sum + next, 0),
    };
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
    return lbs * 0.4536;
  }

  private toLbs(kgs: number): number {
    return kgs * 2.2;
  }
}
