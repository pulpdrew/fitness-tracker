import { Inject, Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATA_SOURCE_INJECTION_TOKEN } from '../constants';
import DataSource from '../types/data-source';
import { ExerciseSet, WeightUnit, Workout } from '../types/workout';
import { SettingsService } from './settings.service';

export interface ExerciseStatsSummary {
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
  stats$ = combineLatest([
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
  ): Map<string, ExerciseStatsSummary[]> {
    const sets = new Map<string, Map<Date, ExerciseSet[]>>();
    for (const workout of workouts) {
      const date = workout.date;
      for (const exercise of workout.exercises) {
        const id = exercise.type.id;

        if (!sets.has(id)) {
          sets.set(id, new Map());
        }

        const existingSets = sets.get(id)?.get(date) || [];
        const newSets = existingSets.concat(exercise.sets);
        sets.get(id)?.set(date, newSets);
      }
    }

    const stats = new Map<string, ExerciseStatsSummary[]>();
    for (const [id, map] of sets.entries()) {
      const summaries = Array.from(map.entries())
        .map(([date, sets]) => this.buildDaySummary(date, sets, weightUnits))
        .sort(
          (a, b) => b.date.getUTCMilliseconds() - a.date.getUTCMilliseconds()
        );
      stats.set(id, summaries);
    }

    return stats;
  }

  private buildDaySummary(
    date: Date,
    sets: ExerciseSet[],
    weightUnits: WeightUnit
  ): ExerciseStatsSummary {
    const summary: ExerciseStatsSummary = {
      date,
      sets,
      weightUnits,
      maxDuration: 0,
      totalDuration: 0,
      maxReps: 0,
      totalReps: 0,
      maxWeight: 0,
      totalWeight: 0,
    };

    for (const set of sets) {
      const weight = set.weight
        ? this.ensureUnit(set.weight!, set.weightUnits!, weightUnits)
        : 0;

      if (weight && weight > summary.maxWeight) {
        summary.maxWeight = weight;
      }

      if (weight) {
        summary.totalWeight += weight * (set.reps || 1);
      }

      if (set.reps && set.reps > summary.maxReps) {
        summary.maxReps = set.reps;
      }

      if (set.reps) {
        summary.totalReps += set.reps;
      }

      if (set.duration && set.duration > summary.maxDuration) {
        summary.maxDuration = set.duration;
      }

      if (set.duration) {
        summary.totalDuration += set.duration;
      }
    }

    return summary;
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
