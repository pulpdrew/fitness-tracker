import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseSet } from '../types/workout';

@Pipe({
  name: 'set',
})
export class SetPipe implements PipeTransform {
  transform(set: ExerciseSet): string {
    let display = '';

    if (set.reps) {
      display = `${set.reps}`;
    }

    if (set.reps && !set.weight && !set.duration) {
      display += ' reps';
    } else if (set.reps) {
      display += ' x ';
    }

    if (set.weight) {
      display += `${set.weight}${set.weightUnits}`;
    }

    if (set.duration && set.weight) {
      display += `for ${set.duration} sec`;
    } else if (set.duration) {
      display += `${set.duration} sec`;
    }

    return display || 'Empty Set';
  }
}
