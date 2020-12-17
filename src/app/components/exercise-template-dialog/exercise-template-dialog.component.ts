import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExerciseTemplate } from 'src/app/types/exercise-template';
import { SetField } from 'src/app/types/workout';

@Component({
  selector: 'app-exercise-template-dialog',
  templateUrl: './exercise-template-dialog.component.html',
  styleUrls: ['./exercise-template-dialog.component.scss'],
})
export class ExerciseTemplateDialogComponent {
  form = new FormGroup({
    name: new FormControl(this.template.name),
    reps: new FormControl(this.template.fields.includes(SetField.REPS)),
    weight: new FormControl(this.template.fields.includes(SetField.WEIGHT)),
    time: new FormControl(this.template.fields.includes(SetField.TIME)),
  });

  constructor(
    public dialogRef: MatDialogRef<ExerciseTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private template: ExerciseTemplate
  ) {}

  save(): void {
    const name = this.form.get('name')?.value;
    const fields = [SetField.REPS, SetField.TIME, SetField.WEIGHT].filter(
      (f) => !!this.form.get(f)?.value
    );

    const updated: ExerciseTemplate = {
      id: this.template.id,
      userDefined: true,
      name,
      fields,
    };

    this.dialogRef.close(updated);
  }
}
