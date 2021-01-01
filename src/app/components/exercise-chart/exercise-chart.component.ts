import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ExerciseStatsService,
  ExerciseStatsSummary,
} from 'src/app/services/exercise-stats.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import { WeightUnit } from 'src/app/types/workout';

interface Series {
  name: string;
  series: {
    name: Date;
    value: number;
  }[];
}

@Component({
  selector: 'app-exercise-chart',
  templateUrl: './exercise-chart.component.html',
  styleUrls: ['./exercise-chart.component.scss'],
})
export class ExerciseChartComponent implements OnInit, OnChanges {
  @Input() exerciseType: ExerciseType | null = null;

  private dataSubscription = this.getDataSubscription();
  data: Series[] = [];

  dataIsEmpty = true;
  weightUnit = WeightUnit.KG;

  constructor(
    private statsService: ExerciseStatsService,
    private settings: SettingsService
  ) {
    this.settings.defaultWeightUnit$.subscribe(
      (unit) => (this.weightUnit = unit)
    );
  }

  ngOnInit(): void {
    this.dataSubscription.unsubscribe();
    this.dataSubscription = this.getDataSubscription();
  }

  ngOnChanges(): void {
    this.dataSubscription.unsubscribe();
    this.dataSubscription = this.getDataSubscription();
  }

  private getDataSubscription(): Subscription {
    return this.statsService.stats$.subscribe((stats) => {
      const type = this.exerciseType?.id || '';
      this.data = this.buildSeries(type, stats);
      this.dataIsEmpty = this.data.length == 0;
    });
  }

  private buildSeries(
    type: string,
    stats: Map<string, ExerciseStatsSummary[]>
  ): Series[] {
    const data = [];

    if (stats.get(type)?.some((day) => day.totalReps != 0)) {
      data.push({
        name: 'Total Reps',
        series:
          stats.get(type)?.map((day) => ({
            name: day.date,
            value: day.totalReps,
          })) || [],
      });
    }

    if (stats.get(type)?.some((day) => day.maxReps != 0)) {
      data.push({
        name: 'Max Reps',
        series:
          stats.get(type)?.map((day) => ({
            name: day.date,
            value: day.maxReps,
          })) || [],
      });
    }

    if (stats.get(type)?.some((day) => day.totalDuration != 0)) {
      data.push({
        name: 'Total Duration',
        series:
          stats.get(type)?.map((day) => ({
            name: day.date,
            value: day.totalDuration,
          })) || [],
      });
    }

    if (stats.get(type)?.some((day) => day.maxDuration != 0)) {
      data.push({
        name: 'Max Duration',
        series:
          stats.get(type)?.map((day) => ({
            name: day.date,
            value: day.maxDuration,
          })) || [],
      });
    }

    if (stats.get(type)?.some((day) => day.totalWeight != 0)) {
      data.push({
        name: 'Total Weight',
        series:
          stats.get(type)?.map((day) => ({
            name: day.date,
            value: day.totalWeight,
          })) || [],
      });
    }

    if (stats.get(type)?.some((day) => day.maxWeight != 0)) {
      data.push({
        name: 'Max Weight',
        series:
          stats.get(type)?.map((day) => ({
            name: day.date,
            value: day.maxWeight,
          })) || [],
      });
    }

    return data;
  }
}
