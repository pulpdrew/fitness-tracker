import { Pipe, PipeTransform } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { SetField } from './exercise-set';

export const ID = 'id';
export const NAME = 'name';
export const FIELDS = 'fields';
export const CATEGORIES = 'categories';

/**
 * The muscle region used by an exercise.
 */
export enum ExerciseCategory {
  SHOULDERS = 'shoulders',
  TRICEPS = 'triceps',
  BICEPS = 'biceps',
  CHEST = 'chest',
  BACK = 'back',
  LEGS = 'legs',
  ABS = 'abs',
  CARDIO = 'cardio',
}

/**
 * All the available exercise categories
 */
export const exerciseCategories = Object.values(ExerciseCategory);

/**
 * Format an ExerciseCategory to be displayed to the user.
 *
 * @param category the category to format
 */
export function fmtDisplayExerciseCategory(category: ExerciseCategory): string {
  switch (category) {
    case ExerciseCategory.SHOULDERS:
      return 'Shoulders';
    case ExerciseCategory.TRICEPS:
      return 'Triceps';
    case ExerciseCategory.BICEPS:
      return 'Biceps';
    case ExerciseCategory.CHEST:
      return 'Chest';
    case ExerciseCategory.BACK:
      return 'Back';
    case ExerciseCategory.LEGS:
      return 'Legs';
    case ExerciseCategory.ABS:
      return 'Abs';
    case ExerciseCategory.CARDIO:
      return 'Cardio';
  }
}

/**
 * A type of exercise, describing the exercise name and the fields within each set
 */

export class ExerciseType {
  public readonly [ID]: string;
  public readonly [NAME]: string;
  public readonly [FIELDS]: SetField[];
  public readonly [CATEGORIES]: ExerciseCategory[];

  constructor(public readonly data: ExerciseTypeData) {
    this[ID] = data[ID];
    this[NAME] = data[NAME];
    this[FIELDS] = data[FIELDS];
    this[CATEGORIES] = data[CATEGORIES];
  }

  /**
   * Returns a new, generated, empty Exercise type
   */
  static empty(): ExerciseType {
    return new ExerciseType({
      [ID]: uuidv4(),
      [NAME]: '',
      [FIELDS]: [],
      [CATEGORIES]: [],
    });
  }
}

/**
 * The most recent version of ExerciseTypeData, used by ExerciseType
 */
export type ExerciseTypeData = ExerciseTypeDataV1;

/**
 * Version 1 of the serializable data describing an ExerciseType
 */
export interface ExerciseTypeDataV1 {
  [ID]: string;
  [NAME]: string;
  [FIELDS]: SetField[];
  [CATEGORIES]: ExerciseCategory[];
}

@Pipe({
  name: 'displayCategories',
})
export class DisplayCategoriesPipe implements PipeTransform {
  transform(values: ExerciseCategory[]): string {
    return (
      values.map((v) => fmtDisplayExerciseCategory(v)).join(', ') || 'None'
    );
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
