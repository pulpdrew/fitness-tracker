import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent {
  @Input() exercise = new FormGroup({});

  get sets(): FormArray {
    return this.exercise.get('sets') as FormArray;
  }

  addSet(): void {
    this.sets.push(this.getEmptySetGroup());
  }

  private getEmptySetGroup(): FormGroup {
    return new FormGroup({
      weight: new FormControl(),
      weightUnits: new FormControl('lb'),
      reps: new FormControl(),
      time: new FormControl(),
    });
  }
}
