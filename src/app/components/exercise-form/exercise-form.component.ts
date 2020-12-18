import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SETS_ARRAY_KEY } from 'src/app/pages/add-workout-page/add-workout-page.component';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseType } from 'src/app/types/exercise-type';
import { DEFAULT_WEIGHT_UNIT, SetField } from 'src/app/types/workout';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {
  /**
   * The exercise type of this Exercise
   */
  @Input() type = '';

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

  SETS_ARRAY_KEY = SETS_ARRAY_KEY;

  constructor(private rxdb: RxdbService) {}

  async ngOnInit(): Promise<void> {
    this.type$ = this.rxdb.exerciseTypes$.pipe(
      map((exercises) => exercises.find((e) => e.id === this.type))
    );

    this.name$ = this.type$.pipe(map((t) => t?.name || 'Unknown Name'));
    this.fields$ = this.type$.pipe(map((t) => t?.fields || []));
  }

  get sets(): FormArray {
    return this.form.get(SETS_ARRAY_KEY) as FormArray;
  }

  addSet(): void {
    if (this.sets.length > 0) {
      this.sets.push(this.copyLastSetGroup());
    } else {
      this.sets.push(this.getEmptySetGroup());
    }
  }

  removeSet(index: number): void {
    this.sets.removeAt(index);
  }

  private copyLastSetGroup(): FormGroup {
    const lastGroup = this.sets.at(this.sets.length - 1);
    return new FormGroup({
      [SetField.WEIGHT]: new FormControl(
        lastGroup.get(SetField.WEIGHT)?.value || ''
      ),
      [SetField.WEIGHT_UNITS]: new FormControl(
        lastGroup.get(SetField.WEIGHT_UNITS)?.value || ''
      ),
      [SetField.REPS]: new FormControl(
        lastGroup.get(SetField.REPS)?.value || ''
      ),
      [SetField.DURATION]: new FormControl(
        lastGroup.get(SetField.DURATION)?.value || ''
      ),
    });
  }

  private getEmptySetGroup(): FormGroup {
    return new FormGroup({
      [SetField.WEIGHT]: new FormControl(''),
      [SetField.WEIGHT_UNITS]: new FormControl(DEFAULT_WEIGHT_UNIT),
      [SetField.REPS]: new FormControl(''),
      [SetField.DURATION]: new FormControl(''),
    });
  }
}
