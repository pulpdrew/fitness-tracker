import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditExerciseTypeDialogComponent } from 'src/app/components/edit-exercise-type-dialog/edit-exercise-type-dialog.component';
import DataStore, { DATA_STORE } from 'src/app/types/data-store';
import { emptyExerciseType, ExerciseType } from 'src/app/types/exercise-type';

@Component({
  selector: 'app-exercise-repo-page',
  templateUrl: './exercise-repo-page.component.html',
  styleUrls: ['./exercise-repo-page.component.scss'],
})
export class ExerciseRepoPageComponent {
  exercises$ = this.data.exerciseTypes$.pipe(
    map((types) =>
      Array.from(types.values()).sort((a, b) => a.name.localeCompare(b.name))
    )
  );

  private _currentlyViewing$ = new BehaviorSubject<ExerciseType | null>(null);
  currentlyViewing$: Observable<ExerciseType | null> = this._currentlyViewing$.asObservable();

  constructor(
    @Inject(DATA_STORE) private data: DataStore,
    private dialog: MatDialog
  ) {
    this.exercises$.subscribe((types) => {
      if (types.length > 0 && !this._currentlyViewing$.value) {
        this._currentlyViewing$.next(types[0]);
      }
    });
  }

  edit(type: ExerciseType = emptyExerciseType()): void {
    const ref = this.dialog.open(EditExerciseTypeDialogComponent, {
      minWidth: '40ex',
      data: type,
    });

    ref.afterClosed().subscribe((editedType) => {
      if (editedType) this.data.upsertExerciseType(editedType);
    });
  }

  remove(type: ExerciseType): void {
    this.data.deleteExerciseType(type);
  }

  view(exercise: ExerciseType): void {
    this._currentlyViewing$.next(exercise);
  }

  getId(index: number, type: ExerciseType): string {
    return type.id;
  }
}
