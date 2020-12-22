import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EXERCISE_TYPE_ID_KEY, SETS_ARRAY_KEY } from 'src/app/constants';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import {
  copySetForm,
  emptySetForm,
  SetField,
  weightUnits,
} from 'src/app/types/workout';

const DEFAULT_EXERCISE_NAME = 'Exercise name is unavailable';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {
  /**
   * The form backing the exercise data
   */
  @Input() form: FormGroup = new FormGroup({
    [SETS_ARRAY_KEY]: new FormArray([]),
  });

  /**
   * The exercise type corresponding to the input `type`
   */
  type$: Observable<ExerciseType | undefined> = of();

  /**
   * The name of this exercise, from `type$`
   */
  name$: Observable<string> = of('');

  /**
   * The fields displayed for this exercise type, from `type$`
   */
  fields$: Observable<SetField[]> = of([]);

  // Imports used in the template
  SETS_ARRAY_KEY = SETS_ARRAY_KEY;
  SetField = SetField;
  units = weightUnits;

  constructor(private rxdb: RxdbService) {}

  async ngOnInit(): Promise<void> {
    this.type$ = this.rxdb.exerciseTypes$.pipe(
      map((exercises) =>
        exercises.find(
          (e) => e.id === this.form.get(EXERCISE_TYPE_ID_KEY)?.value || ''
        )
      )
    );

    this.name$ = this.type$.pipe(map((t) => t?.name || DEFAULT_EXERCISE_NAME));
    this.fields$ = this.type$.pipe(map((t) => t?.fields || []));
  }

  get sets(): FormArray {
    return this.form.get(SETS_ARRAY_KEY) as FormArray;
  }

  addSet(): void {
    if (this.sets.length > 0) {
      this.sets.push(
        copySetForm(this.sets.at(this.sets.length - 1) as FormGroup)
      );
    } else {
      this.sets.push(emptySetForm());
    }
  }

  removeSet(index: number): void {
    this.sets.removeAt(index);
  }
}
