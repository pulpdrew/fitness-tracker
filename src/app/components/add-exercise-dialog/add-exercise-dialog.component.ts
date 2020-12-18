import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import { EditExerciseTypeDialogComponent } from '../edit-exercise-type-dialog/edit-exercise-type-dialog.component';

@Component({
  selector: 'app-add-exercise-dialog',
  templateUrl: './add-exercise-dialog.component.html',
  styleUrls: ['./add-exercise-dialog.component.scss'],
})
export class AddExerciseDialogComponent {
  selected = new FormControl();

  exercises$: Observable<ExerciseType[]> = this.rxdb.exerciseTypes$;

  filter$: Observable<string> = concat(of(''), this.selected.valueChanges).pipe(
    map((f) => (typeof f === 'string' ? f : f.name))
  );

  filteredExercises$ = combineLatest([this.exercises$, this.filter$]).pipe(
    map(([exercises, filter]) =>
      exercises.filter(
        (e) =>
          !filter ||
          e?.name
            ?.toLocaleLowerCase()
            .startsWith(filter?.toLocaleLowerCase() || '')
      )
    )
  );

  constructor(
    public dialogRef: MatDialogRef<EditExerciseTypeDialogComponent>,
    private rxdb: RxdbService
  ) {}

  display(exercise: ExerciseType): string {
    return exercise?.name || '';
  }
}
