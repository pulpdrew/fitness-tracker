import { v4 as uuidv4 } from 'uuid';
import { SetField } from './workout';

/**
 * A type of exercise, describing the exercise name and the fields within each set
 */
export interface ExerciseType {
  id: string;
  name: string;
  fields: SetField[];
  userDefined: boolean;
}

/**
 * Returns a new, generated, empty Exercise type
 */
export function emptyExerciseType(userDefined = true): ExerciseType {
  return {
    id: uuidv4(),
    name: '',
    fields: [],
    userDefined,
  };
}
