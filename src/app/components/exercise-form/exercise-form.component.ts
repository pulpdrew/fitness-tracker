import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoryEntry, HistoryService } from 'src/app/services/history.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Exercise, EXERCISE_TYPE, SETS } from 'src/app/types/exercise';
import { ExerciseSet, WEIGHT_UNITS } from 'src/app/types/exercise-set';
import { ExerciseType } from 'src/app/types/exercise-type';
import { ALL_WEIGHT_UNITS } from 'src/app/types/weight';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {
  /**
   * The form backing the exercise data
   */
  @Input() form: FormGroup = new Exercise([], ExerciseType.empty()).toForm();

  /**
   * The Id of the workout that is being edited
   */
  @Input() workoutId: string | null = '';

  /**
   * Event that fires when this exercise is moved towards the beginning
   * of the list of exercises.
   */
  @Output() up = new EventEmitter<void>();

  /**
   * Event that fires when this exercise is moved towards the end
   * of the list of exercises.
   */
  @Output() down = new EventEmitter<void>();

  /**
   * Event that fires when this exercise is removed from the list of
   * exercises.
   */
  @Output() remove = new EventEmitter<void>();

  /**
   * The ExerciseType corresponding to the given exercise form
   */
  type: ExerciseType = ExerciseType.empty();

  /**
   * The sets completed in the most recent workout that wasn't this one
   */
  previousEffort$: Observable<HistoryEntry | undefined> = of();

  // Imports used in the template
  readonly SETS_ARRAY_KEY = SETS;
  readonly units = ALL_WEIGHT_UNITS;

  constructor(
    private readonly settings: SettingsService,
    private readonly history: HistoryService
  ) {}

  async ngOnInit(): Promise<void> {
    this.type = this.form.get(EXERCISE_TYPE)?.value || ExerciseType.empty();

    this.previousEffort$ = this.history.history$.pipe(
      map((history) =>
        history
          .get(this.type.id)
          ?.reverse()
          .find((e) => !!this.workoutId && e.workoutID !== this.workoutId)
      )
    );
  }

  get sets(): FormArray {
    return this.form.get(SETS) as FormArray;
  }

  get rawSets(): FormGroup[] {
    return this.sets.controls as FormGroup[];
  }

  addSet(): void {
    if (this.sets.length > 0) {
      this.sets.push(
        ExerciseSet.fromForm(
          this.sets.at(this.sets.length - 1) as FormGroup
        ).toForm()
      );
    } else {
      const setForm = new ExerciseSet({}).toForm();
      setForm.get(WEIGHT_UNITS)?.setValue(this.settings.defaultWeightUnit);
      this.sets.push(setForm);
    }
  }

  removeSet(index: number): void {
    this.sets.removeAt(index);
  }

  removeExercise(): void {
    this.remove.next();
  }

  moveDown(): void {
    this.down.next();
  }

  moveUp(): void {
    this.up.next();
  }
}
