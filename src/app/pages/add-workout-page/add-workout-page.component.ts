import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { RxdbService } from 'src/app/services/rxdb.service';
import { Set, Exercise, Workout } from 'src/app/types/workout';

const dummyWO: Workout = {
  id: 'id123',
  date: '',
  exercises: [
    {
      name: 'pushups',
      sets: [{ reps: 10 }],
    },
    {
      name: 'situps',
      sets: [{ reps: 12 }],
    },
  ],
};

@Component({
  selector: 'app-add-workout-page',
  templateUrl: './add-workout-page.component.html',
  styleUrls: ['./add-workout-page.component.scss'],
})
export class AddWorkoutPageComponent {
  constructor(private rxdb: RxdbService) {}

  form = this.toForm(dummyWO);

  get exercises(): FormArray {
    return this.form.get('exercises') as FormArray;
  }

  getExercise(index: number): FormGroup {
    return this.exercises.at(index) as FormGroup;
  }

  addExercise(): void {
    this.exercises.push(this.getEmptyExerciseGroup());
  }

  save(): void {
    const workout = this.fromForm(this.form);
    this.rxdb.saveWorkout(workout);
  }

  private getEmptyExerciseGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      sets: new FormArray([]),
    });
  }

  private fromForm(form: FormGroup): Workout {
    const exerciseGroups = (form.get('exercises') as FormArray)
      .controls as FormGroup[];

    const exercises: Exercise[] = exerciseGroups.map((eg) => {
      const name = eg.get('name')?.value || '';
      const setGroups = (eg.get('sets') as FormArray).controls as FormGroup[];

      const sets: Set[] = setGroups.map((sg) => {
        const set: Set = <Set>{};

        if (sg.get('reps')?.value) {
          set['reps'] = Number.parseInt(sg.get('reps')?.value || '0');
        }

        if (sg.get('time')?.value) {
          set['time'] = Number.parseInt(sg.get('time')?.value || '0');
        }

        if (sg.get('weight')?.value) {
          set['weight'] = Number.parseInt(sg.get('weight')?.value || '0');
        }

        if (sg.get('weightUnits')?.value) {
          set['weightUnits'] = sg.get('weightUnits')?.value;
        }

        return set;
      });

      return {
        name,
        sets,
      };
    });

    return {
      id: Date.now().toString(),
      date: new Date().toUTCString(),
      exercises,
    };
  }

  private toForm(workout: Workout): FormGroup {
    return new FormGroup({
      exercises: new FormArray(
        workout.exercises.map(
          (exercise) =>
            new FormGroup({
              name: new FormControl(exercise.name),
              sets: new FormArray(
                exercise.sets.map(
                  (set) =>
                    new FormGroup({
                      weight: new FormControl(set.weight),
                      weightUnits: new FormControl(set.weightUnits),
                      reps: new FormControl(set.reps),
                      time: new FormControl(set.time),
                    })
                )
              ),
            })
        )
      ),
    });
  }
}
