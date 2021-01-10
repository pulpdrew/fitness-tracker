import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  emptyExerciseStats,
  ExerciseStatsService,
} from 'src/app/services/exercise-stats.service';
import { SettingsService } from 'src/app/services/settings.service';
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

  stats$ = combineLatest([this.type$, this.statsService.stats$]).pipe(
    map(([type, stats]) => stats.get(type.id) || emptyExerciseStats())
  );

  weightUnit$ = this.settings.defaultWeightUnit$;
  history$ = this.stats$.pipe(map((stats) => stats.history));

  maxWeight$ = this.stats$.pipe(
    map((stats) =>
      stats.maxWeight ? `${stats.maxWeight} ${stats.maxWeightUnits}` : ''
    )
  );

  maxReps$ = this.stats$.pipe(
    map((stats) => (stats.maxReps ? `${stats.maxReps}` : ''))
  );

  maxDuration$ = this.stats$.pipe(
    map((stats) => (stats.maxDuration ? `${stats.maxDuration} seconds` : ''))
  );

  constructor(
    private statsService: ExerciseStatsService,
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
