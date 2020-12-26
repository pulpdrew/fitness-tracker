import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditExerciseTypeDialogComponent } from 'src/app/components/edit-exercise-type-dialog/edit-exercise-type-dialog.component';
import { RxdbService } from 'src/app/services/rxdb.service';
import { emptyExerciseType, ExerciseType } from 'src/app/types/exercise-type';

@Component({
  selector: 'app-exercise-repo-page',
  templateUrl: './exercise-repo-page.component.html',
  styleUrls: ['./exercise-repo-page.component.scss'],
})
export class ExerciseRepoPageComponent {
  exercises$ = this.rxdb.exerciseTypes$;

  constructor(private rxdb: RxdbService, private dialog: MatDialog) {}

  edit(type: ExerciseType = emptyExerciseType()): void {
    const ref = this.dialog.open(EditExerciseTypeDialogComponent, {
      minWidth: '40ex',
      data: type,
    });

    ref.afterClosed().subscribe((editedType) => {
      if (editedType) this.rxdb.saveExerciseType(editedType);
    });
  }

  remove(type: ExerciseType): void {
    this.rxdb.deleteExerciseType(type);
  }
}
