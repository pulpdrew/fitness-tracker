import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DURATION, WEIGHT, WEIGHT_UNITS } from 'src/app/types/exercise-set';
import { ALL_WEIGHT_UNITS } from 'src/app/types/weight';
import { emptyExerciseType, ExerciseType } from '../../types/exercise-type';

@Component({
  selector: 'app-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.scss'],
})
export class SetFormComponent {
  @Input() form: FormGroup = new FormGroup({});
  @Input() type: ExerciseType = emptyExerciseType();
  fields = this.type.fields;

  @Output() remove = new EventEmitter<void>();

  readonly units = ALL_WEIGHT_UNITS;
  readonly DURATION = DURATION;
  readonly WEIGHT = WEIGHT;
  readonly WEIGHT_UNITS = WEIGHT_UNITS;

  onRemove(): void {
    this.remove.emit();
  }
}
