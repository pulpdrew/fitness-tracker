import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoryService } from 'src/app/services/history.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ExerciseStats, StatsService } from 'src/app/services/stats.service';
import { emptyExerciseType, ExerciseType } from 'src/app/types/exercise-type';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
})
export class ExerciseDetailsComponent implements OnInit, OnChanges {
  @Output() edit = new EventEmitter<ExerciseType>();
  @Output() remove = new EventEmitter<ExerciseType>();

  @Input() type = emptyExerciseType();
  private _type$ = new BehaviorSubject<ExerciseType>(this.type);
  private type$ = this._type$.asObservable();

  stats$: Observable<ExerciseStats> = combineLatest([
    this.type$,
    this.statsService.stats$,
  ]).pipe(map(([type, stats]) => stats.get(type.id) || { type, workouts: [] }));

  weightUnit$ = this.settings.defaultWeightUnit$;
  history$ = combineLatest([this.historyService.history$, this.type$]).pipe(
    map(([histories, type]) => histories.get(type.id)?.reverse())
  );

  maxWeight$ = this.stats$.pipe(
    map((stats) =>
      stats.maxWeight ? `${stats.maxWeight} ${stats.weightUnits}` : ''
    )
  );

  maxReps$ = this.stats$.pipe(
    map((stats) => (stats.maxReps ? `${stats.maxReps}` : ''))
  );

  maxDuration$ = this.stats$.pipe(
    map((stats) => (stats.maxDuration ? `${stats.maxDuration} seconds` : ''))
  );

  constructor(
    private statsService: StatsService,
    private historyService: HistoryService,
    private settings: SettingsService
  ) {}

  ngOnInit(): void {
    if (this.type) {
      this._type$.next(this.type);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const type = changes['type'];
    if (type.currentValue) {
      this._type$.next(type.currentValue);
    }
  }

  onEdit(): void {
    this.edit.emit(this.type);
  }

  onRemove(): void {
    this.remove.emit(this.type);
  }
}
