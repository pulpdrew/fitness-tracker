import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CHART_COLORS } from 'src/app/constants';
import { ExerciseStats, WorkoutStats } from 'src/app/services/stats.service';
import { WeightUnit } from 'src/app/types/workout';

type SeriesDescription = {
  name: string;
  color: string;
  extractor: (day: WorkoutStats) => number | undefined;
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
  @Input() stats?: ExerciseStats | null;
  @Input() weightUnit?: WeightUnit | null;

  private get history(): WorkoutStats[] {
    return this.stats?.workouts || [];
  }

  /**
   * Whether the user has previously altered the selected
   * series for the current exercise.
   */
  private hasSelected = false;

  /**
   * The names of the series that are available for the
   * current exercise.
   */
  availableSeriesNames: string[] = [];

  /**
   * The colors corresponding to the series in `availableSeries`,
   * in the same order as the corresponding series.
   */
  availableColors: string[] = [];

  /**
   * The names of the series that are toggled on (selected)
   * in the chart legend. Updated by the legend component.
   */
  selectedSeriesNames: string[] = [];

  /**
   * The data that should be plotted on the line chart.
   */
  displayedData: Series[] = [];

  /**
   * The colors corresponding to the series in `displayedData`
   */
  displayedColors: ColorScheme = {
    domain: CHART_COLORS,
  };

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['stats'];
    if (
      change &&
      change.currentValue?.type.id !== change.previousValue?.type.id
    ) {
      this.hasSelected = false;
    }
    this.updateChart();
  }

  onSeriesSelectedChange(selected: string[]): void {
    this.selectedSeriesNames = selected;
    this.hasSelected = true;
    this.updateChart();
  }

  private updateChart(): void {
    const series = ExerciseChartComponent.buildSeries(this.history);

    // The available series are any series for which at least 2 days of data is available
    this.availableSeriesNames = series
      .filter((series) => series.series.length > 1)
      .map((series) => series.name);

    // Filter for the colors corresponding to the available series
    this.availableColors = seriesDescriptions
      .filter((desc) => this.availableSeriesNames.includes(desc.name))
      .map((desc) => desc.color);

    // If the user hasn't selected series with the legend, show all of the available series
    if (!this.hasSelected) {
      this.selectedSeriesNames = series.map((desc) => desc.name);
    }

    // Display only the selected series
    this.displayedData = series.filter((series) =>
      this.selectedSeriesNames.includes(series.name)
    );

    // Filter for the corresponding colors to display
    this.displayedColors = {
      domain: seriesDescriptions
        .filter(
          (desc) =>
            this.selectedSeriesNames.includes(desc.name) &&
            !!series.find((s) => desc.name === s.name)
        )
        .map((desc) => desc.color),
    };
  }

  static buildSeries(history: WorkoutStats[]): Series[] {
    const seriesData: Series[] = [];

    for (const series of seriesDescriptions) {
      if (history.some(series.extractor)) {
        seriesData.push({
          name: series.name,
          series: history.filter(series.extractor).map((day) => ({
            name: day.workoutDate,
            value: series.extractor(day) || 0,
          })),
        });
      }
    }

    return seriesData;
  }
}
