import { v4 as uuidv4 } from 'uuid';
import { SetField } from './workout';

/**
 * A template for an Exercise, with defined set fields
 */
export interface ExerciseTemplate {
  id: string;
  name: string;
  fields: SetField[];
  userDefined: boolean;
}

export function emptyTemplate(): ExerciseTemplate {
  return {
    id: uuidv4(),
    name: '',
    fields: [],
    userDefined: false,
  };
}
