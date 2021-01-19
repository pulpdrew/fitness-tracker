import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseSet } from '../types/exercise-set';

@Pipe({
  name: 'set',
})
export class SetPipe implements PipeTransform {
  transform(set: ExerciseSet): string {
    return set.toString();
  }
}
