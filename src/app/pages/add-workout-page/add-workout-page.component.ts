import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Workout } from 'src/app/types/workout';

const dummyWO: Workout = {
  id: 'id123',
  date: '',
  exercises: [
    {
      name: 'pushups',
      sets: [{ index: 1, reps: 10 }],
    },
    {
      name: 'situps',
      sets: [{ index: 1, reps: 12 }],
    },
  ],
};

@Component({
  selector: 'app-add-workout-page',
  templateUrl: './add-workout-page.component.html',
  styleUrls: ['./add-workout-page.component.scss'],
})
export class AddWorkoutPageComponent {
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

  private getEmptyExerciseGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      sets: new FormArray([]),
    });
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
