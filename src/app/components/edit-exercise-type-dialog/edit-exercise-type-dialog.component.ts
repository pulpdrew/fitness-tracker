import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExerciseType } from 'src/app/types/exercise-type';
import { SetField } from 'src/app/types/workout';

const NAME_KEY = 'name';

@Component({
  selector: 'app-edit-exercise-type-dialog',
  templateUrl: './edit-exercise-type-dialog.component.html',
  styleUrls: ['./edit-exercise-type-dialog.component.scss'],
})
export class EditExerciseTypeDialogComponent {
  form = new FormGroup({
    [NAME_KEY]: new FormControl(this.template.name),
    [SetField.REPS]: new FormControl(
      this.template.fields.includes(SetField.REPS)
    ),
    [SetField.WEIGHT]: new FormControl(
      this.template.fields.includes(SetField.WEIGHT)
    ),
    [SetField.DURATION]: new FormControl(
      this.template.fields.includes(SetField.DURATION)
    ),
  });

  constructor(
    public dialogRef: MatDialogRef<EditExerciseTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private template: ExerciseType
  ) {}

  save(): void {
    const name = this.form.get(NAME_KEY)?.value;
    const fields = [SetField.REPS, SetField.DURATION, SetField.WEIGHT].filter(
      (f) => !!this.form.get(f)?.value
    );

    const updated: ExerciseType = {
      id: this.template.id,
      userDefined: true,
      name,
      fields,
    };

    this.dialogRef.close(updated);
  }
}
