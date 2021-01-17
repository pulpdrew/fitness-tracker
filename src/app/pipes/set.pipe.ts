import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from '../types/duration';
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

    if (set.duration) {
      const duration = new Duration(set.duration).toString();
      if (set.weight) {
        display += `for ${duration}`;
      } else if (set.duration) {
        display += `${duration}`;
      }
    }

    return display || 'Empty Set';
  }
}
