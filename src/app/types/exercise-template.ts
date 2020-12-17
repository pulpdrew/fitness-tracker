import { SetField } from './workout';

/**
 * A template for an Exercise, with defined set fields
 */
export interface ExerciseTemplate {
  name: string;
  fields: SetField[];
  userDefined: boolean;
}
