import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { WorkoutSummary } from 'src/app/services/exercise-stats.service';
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
  @Input() history: WorkoutSummary[] = [];
  @Input() weightUnit: WeightUnit = WeightUnit.KG;

  data: Series[] = [];

  ngOnInit(): void {
    if (this.history) {
      this.data = this.buildSeries(this.history);
    }
  }

  ngOnChanges(): void {
    if (this.history) {
      this.data = this.buildSeries(this.history);
    }
  }

  private buildSeries(history: WorkoutSummary[]): Series[] {
    const data = [];

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
