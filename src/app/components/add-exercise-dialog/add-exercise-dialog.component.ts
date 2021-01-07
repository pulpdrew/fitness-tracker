import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATA_SOURCE_INJECTION_TOKEN } from 'src/app/constants';
import DataSource from 'src/app/types/data-source';
import { emptyExerciseType, ExerciseType } from 'src/app/types/exercise-type';
import { EditExerciseTypeDialogComponent } from '../edit-exercise-type-dialog/edit-exercise-type-dialog.component';

@Component({
  selector: 'app-add-exercise-dialog',
  templateUrl: './add-exercise-dialog.component.html',
  styleUrls: ['./add-exercise-dialog.component.scss'],
})
export class AddExerciseDialogComponent {
  selected = new FormControl();

  exercises$: Observable<ExerciseType[]> = this.data.exerciseTypes$.pipe(
    map((types) => types.sort((a, b) => a.name.localeCompare(b.name)))
  );

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
    private dialog: MatDialog,
    @Inject(DATA_SOURCE_INJECTION_TOKEN) private data: DataSource
  ) {}

  display(exercise: ExerciseType): string {
    return exercise?.name || '';
  }

  createExercise(): void {
    const ref = this.dialog.open(EditExerciseTypeDialogComponent, {
      minWidth: '40ex',
      minHeight: '20em',
      data: {
        ...emptyExerciseType(),
        name: this.selected.value.name || this.selected.value || '',
      },
    });

    ref.afterClosed().subscribe((newType) => {
      if (newType) {
        this.data.upsertExerciseType(newType);
        this.selected.setValue(newType);
      }
    });
  }
}
