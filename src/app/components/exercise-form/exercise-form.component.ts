import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { EXERCISE_TYPE_KEY, SETS_ARRAY_KEY } from 'src/app/constants';
import { SettingsService } from 'src/app/services/settings.service';
import { emptyExerciseType, ExerciseType } from 'src/app/types/exercise-type';
import {
  copySetForm,
  emptySetForm,
  exerciseToForm,
  SetField,
  weightUnits,
} from 'src/app/types/workout';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {
  /**
   * The form backing the exercise data
   */
  @Input() form: FormGroup = exerciseToForm({
    sets: [],
    type: emptyExerciseType(),
  });

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
  type: ExerciseType = emptyExerciseType();

  // Imports used in the template
  SETS_ARRAY_KEY = SETS_ARRAY_KEY;
  SetField = SetField;
  units = weightUnits;

  constructor(private settings: SettingsService) {}

  async ngOnInit(): Promise<void> {
    this.type = this.form.get(EXERCISE_TYPE_KEY)?.value || emptyExerciseType();
  }

  get sets(): FormArray {
    return this.form.get(SETS_ARRAY_KEY) as FormArray;
  }

  get rawSets(): FormGroup[] {
    return this.sets.controls as FormGroup[];
  }

  addSet(): void {
    if (this.sets.length > 0) {
      this.sets.push(
        copySetForm(this.sets.at(this.sets.length - 1) as FormGroup)
      );
    } else {
      const setForm = emptySetForm();
      setForm
        .get(SetField.WEIGHT_UNITS)
        ?.setValue(this.settings.defaultWeightUnit);
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
