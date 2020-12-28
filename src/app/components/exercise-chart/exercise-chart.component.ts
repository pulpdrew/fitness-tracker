import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import { Exercise, ExerciseSet, Workout } from 'src/app/types/workout';

interface DaySummary {
  date: Date;
  sets: ExerciseSet[];
  totalWeight: number;
  maxWeight: number;
  totalReps: number;
  maxReps: number;
  totalDuration: number;
  maxDuration: number;
}

interface Series {
  name: string;
  series: {
    name: string;
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

  constructor(private rxdb: RxdbService) {}

  ngOnInit(): void {
    this.dataSubscription.unsubscribe();
    this.dataSubscription = this.getDataSubscription();
  }

  ngOnChanges(): void {
    this.dataSubscription.unsubscribe();
    this.dataSubscription = this.getDataSubscription();
  }

  private getDataSubscription(): Subscription {
    return this.rxdb.workouts$
      .pipe(
        map((workouts) => workouts.filter(this.workoutIsRelevant.bind(this))),
        map((workouts) => workouts.map(this.toSummary.bind(this)))
      )
      .subscribe((days) => {
        this.data = [
          {
            name: 'Total Reps',
            series: days.map((day) => ({
              name: day.date.toLocaleDateString(),
              value: day.totalReps,
            })),
          },
          {
            name: 'Max Reps',
            series: days.map((day) => ({
              name: day.date.toLocaleDateString(),
              value: day.maxReps,
            })),
          },
          {
            name: 'Total Weight',
            series: days.map((day) => ({
              name: day.date.toLocaleDateString(),
              value: day.totalWeight,
            })),
          },
          {
            name: 'Max Weight',
            series: days.map((day) => ({
              name: day.date.toLocaleDateString(),
              value: day.maxWeight,
            })),
          },
          {
            name: 'Total Duration',
            series: days.map((day) => ({
              name: day.date.toLocaleDateString(),
              value: day.totalDuration,
            })),
          },
          {
            name: 'Max Duration',
            series: days.map((day) => ({
              name: day.date.toLocaleDateString(),
              value: day.maxDuration,
            })),
          },
        ];
        console.log(this.data);
      });
  }

  private toSummary(workout: Workout): DaySummary {
    const sets = workout.exercises
      .filter(this.exerciseMatches.bind(this))
      .flatMap((exercise) => exercise.sets);

    const date = new Date(workout.date);

    return {
      date,
      sets,
      totalWeight: sets
        .map((s) => s.weight || 0)
        .reduce((total, next) => total + next),
      totalDuration: sets
        .map((s) => s.duration || 0)
        .reduce((total, next) => total + next),
      totalReps: sets
        .map((s) => s.reps || 0)
        .reduce((total, next) => total + next),
      maxDuration: sets
        .map((s) => s.duration || 0)
        .reduce((max, next) => Math.max(max, next)),
      maxWeight: sets
        .map((s) => s.weight || 0)
        .reduce((max, next) => Math.max(max, next)),
      maxReps: sets
        .map((s) => s.reps || 0)
        .reduce((max, next) => Math.max(max, next)),
    };
  }

  private workoutIsRelevant(workout: Workout): boolean {
    return !!workout.exercises.some(this.exerciseMatches.bind(this));
  }

  private exerciseMatches(exercise: Exercise): boolean {
    return exercise.type === this.exerciseType?.id;
  }
}
