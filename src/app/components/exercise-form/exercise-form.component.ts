import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RxdbService } from 'src/app/services/rxdb.service';
import { ExerciseTemplate } from 'src/app/types/exercise-template';
import { SetField } from 'src/app/types/workout';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {
  @Input() templateId = '';
  @Input() form: FormGroup = new FormGroup({ sets: new FormArray([]) });

  template$: Observable<ExerciseTemplate | undefined> = of();
  name$: Observable<string> = of('');
  fields$: Observable<SetField[]> = of([]);

  constructor(private rxdb: RxdbService) {}

  async ngOnInit(): Promise<void> {
    console.log(this.form);
    this.template$ = this.rxdb.exercises$.pipe(
      map((exercises) => exercises.find((e) => e.id === this.templateId))
    );

    this.name$ = this.template$.pipe(map((t) => t?.name || 'Unknown Name'));
    this.fields$ = this.template$.pipe(map((t) => t?.fields || []));
  }

  get sets(): FormArray {
    return this.form.get('sets') as FormArray;
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
      weight: new FormGroup(lastGroup.get(SetField.WEIGHT)?.value || ''),
      weightUnits: new FormControl(lastGroup.get('weightUnits')?.value || ''),
      reps: new FormControl(lastGroup.get(SetField.REPS)?.value || ''),
      time: new FormControl(lastGroup.get(SetField.TIME)?.value || ''),
    });
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
