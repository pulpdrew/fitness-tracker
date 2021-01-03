import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ExerciseStats,
  ExerciseStatsService,
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
    stats: Map<string, ExerciseStats>
  ): Series[] {
    const data = [];

    const history = stats.get(type)?.history || [];

    if (history.some((day) => day.totalReps != 0)) {
      data.push({
        name: 'Total Reps',
        series:
          history
            .filter((day) => !!day.totalReps)
            .map((day) => ({
              name: day.date,
              value: day.totalReps,
            })) || [],
      });
    }

    if (history.some((day) => day.maxReps != 0)) {
      data.push({
        name: 'Max Reps',
        series:
          history
            .filter((day) => !!day.maxReps)
            .map((day) => ({
              name: day.date,
              value: day.maxReps,
            })) || [],
      });
    }

    if (history.some((day) => day.totalDuration != 0)) {
      data.push({
        name: 'Total Duration',
        series:
          history
            .filter((day) => !!day.totalDuration)
            .map((day) => ({
              name: day.date,
              value: day.totalDuration,
            })) || [],
      });
    }

    if (history.some((day) => day.maxDuration != 0)) {
      data.push({
        name: 'Max Duration',
        series:
          history
            .filter((day) => !!day.maxDuration)
            .map((day) => ({
              name: day.date,
              value: day.maxDuration,
            })) || [],
      });
    }

    if (history.some((day) => day.totalWeight != 0)) {
      data.push({
        name: 'Total Weight',
        series:
          history
            .filter((day) => !!day.totalWeight)
            .map((day) => ({
              name: day.date,
              value: day.totalWeight,
            })) || [],
      });
    }

    if (history.some((day) => day.maxWeight != 0)) {
      data.push({
        name: 'Max Weight',
        series:
          history
            .filter((day) => !!day.maxWeight)
            .map((day) => ({
              name: day.date,
              value: day.maxWeight,
            })) || [],
      });
    }

    return data;
  }
}
