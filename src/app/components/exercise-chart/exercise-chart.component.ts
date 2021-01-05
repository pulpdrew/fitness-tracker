import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CHART_COLORS } from 'src/app/constants';
import { WorkoutSummary } from 'src/app/services/exercise-stats.service';
import { WeightUnit } from 'src/app/types/workout';

type SeriesDescription = {
  name: string;
  color: string;
  extractor: (day: WorkoutSummary) => number;
};

type ColorScheme = {
  domain: string[];
};

type Series = {
  name: string;
  series: {
    name: Date;
    value: number;
  }[];
};

const seriesDescriptions: SeriesDescription[] = [
  {
    name: 'Total Reps',
    extractor: (day) => day.totalReps,
    color: CHART_COLORS[0],
  },
  {
    name: 'Max Reps',
    extractor: (day) => day.maxReps,
    color: CHART_COLORS[1],
  },
  {
    name: 'Total Duration',
    extractor: (day) => day.totalDuration,
    color: CHART_COLORS[2],
  },
  {
    name: 'Max Duration',
    extractor: (day) => day.maxDuration,
    color: CHART_COLORS[3],
  },
  {
    name: 'Total Weight',
    extractor: (day) => day.totalWeight,
    color: CHART_COLORS[4],
  },
  {
    name: 'Max Weight',
    extractor: (day) => day.maxWeight,
    color: CHART_COLORS[5],
  },
];

@Component({
  selector: 'app-exercise-chart',
  templateUrl: './exercise-chart.component.html',
  styleUrls: ['./exercise-chart.component.scss'],
})
export class ExerciseChartComponent implements OnInit, OnChanges {
  @Input() history: WorkoutSummary[] = [];
  @Input() weightUnit: WeightUnit = WeightUnit.KG;

  private hasSelected = false;
  seriesData: Series[] = [];
  availableSeriesNames: string[] = [];
  selectedSeriesNames: string[] = [];
  availableColors: string[] = [];
  colorScheme: ColorScheme = {
    domain: CHART_COLORS,
  };

  ngOnInit(): void {
    if (this.history) {
      this.updateChart();
    }
  }

  ngOnChanges(): void {
    if (this.history) {
      this.updateChart();
    }
  }

  onSeriesSelectedChange(selected: string[]): void {
    this.selectedSeriesNames = selected;
    this.updateChart();
  }

  private updateChart(): void {
    const series = ExerciseChartComponent.buildSeries(this.history);

    if (!this.hasSelected && this.selectedSeriesNames.length == 0) {
      this.selectedSeriesNames = series.map((desc) => desc.name);
      this.hasSelected = true;
    }

    this.availableSeriesNames = series.map((series) => series.name);
    this.availableColors = seriesDescriptions
      .filter((desc) => this.availableSeriesNames.includes(desc.name))
      .map((desc) => desc.color);

    this.seriesData = series.filter((series) =>
      this.selectedSeriesNames.includes(series.name)
    );

    this.colorScheme = {
      domain: seriesDescriptions
        .filter(
          (desc) =>
            this.selectedSeriesNames.includes(desc.name) &&
            !!series.find((s) => desc.name === s.name)
        )
        .map((desc) => desc.color),
    };
  }

  static buildSeries(history: WorkoutSummary[]): Series[] {
    const seriesData: Series[] = [];

    for (const series of seriesDescriptions) {
      if (history.some(series.extractor)) {
        seriesData.push({
          name: series.name,
          series: history.filter(series.extractor).map((day) => ({
            name: day.date,
            value: series.extractor(day),
          })),
        });
      }
    }

    return seriesData;
  }
}
