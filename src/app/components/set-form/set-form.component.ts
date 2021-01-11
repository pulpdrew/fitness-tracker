import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { emptyExerciseType, ExerciseType } from '../../types/exercise-type';
import { SetField, WEIGHT_UNITS } from '../../types/workout';

@Component({
  selector: 'app-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.scss'],
})
export class SetFormComponent {
  @Input() form: FormGroup = new FormGroup({});
  @Input() type: ExerciseType = emptyExerciseType();

  @Output() remove = new EventEmitter<void>();

  SetField = SetField;
  units = WEIGHT_UNITS;

  onRemove(): void {
    this.remove.emit();
  }
}
