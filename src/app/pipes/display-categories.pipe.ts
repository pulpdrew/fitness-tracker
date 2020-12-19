import { Pipe, PipeTransform } from '@angular/core';
import {
  ExerciseCategory,
  fmtDisplayExerciseCategory,
} from '../types/exercise-type';

@Pipe({
  name: 'displayCategories',
})
export class DisplayCategoriesPipe implements PipeTransform {
  transform(values: ExerciseCategory[]): string {
    return values.map((v) => fmtDisplayExerciseCategory(v)).join(', ');
  }
}

@Pipe({
  name: 'displayCategory',
})
export class DisplayCategoryPipe implements PipeTransform {
  transform(value: ExerciseCategory): string {
    return fmtDisplayExerciseCategory(value);
  }
}
