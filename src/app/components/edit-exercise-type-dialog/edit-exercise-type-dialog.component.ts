import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DURATION, REPS, SetField, WEIGHT } from 'src/app/types/exercise-set';
import { exerciseCategories, ExerciseType } from 'src/app/types/exercise-type';

@Component({
  selector: 'app-edit-exercise-type-dialog',
  templateUrl: './edit-exercise-type-dialog.component.html',
  styleUrls: ['./edit-exercise-type-dialog.component.scss'],
})
export class EditExerciseTypeDialogComponent {
  NAME_KEY = 'name';
  CATEGORIES_KEY = 'categories';

  exerciseCategories = exerciseCategories;

  form = new FormGroup({
    [this.NAME_KEY]: new FormControl(this.template.name),
    [this.CATEGORIES_KEY]: new FormControl(this.template.categories),
    [REPS]: new FormControl(this.template.fields.includes(REPS)),
    [WEIGHT]: new FormControl(this.template.fields.includes(WEIGHT)),
    [DURATION]: new FormControl(this.template.fields.includes(DURATION)),
  });

  constructor(
    public dialogRef: MatDialogRef<EditExerciseTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private template: ExerciseType
  ) {}

  save(): void {
    const name = this.form.get(this.NAME_KEY)?.value || '';
    const categories = this.form.get(this.CATEGORIES_KEY)?.value || [];
    const fields = [REPS, DURATION, WEIGHT].filter(
      (f) => !!this.form.get(f)?.value
    ) as SetField[];

    const updated: ExerciseType = {
      id: this.template.id,
      name,
      fields,
      categories,
    };

    this.dialogRef.close(updated);
  }
}
