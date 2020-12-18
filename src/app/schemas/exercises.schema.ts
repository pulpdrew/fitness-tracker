import { RxJsonSchema } from 'rxdb';
import { setFields } from '../types/workout';
import { ExerciseType } from '../types/exercise-type';

/**
 * The schema for the collection of Exercise Types
 */
export const exerciseTypeSchema: RxJsonSchema<ExerciseType> = {
  version: 0,
  title: 'exercise type schema',
  description: '',
  type: 'object',
  properties: {
    id: {
      primary: true,
      type: 'string',
    },
    name: {
      type: 'string',
    },
    userDefined: {
      type: 'boolean',
      default: false,
    },
    fields: {
      type: 'array',
      items: {
        type: 'string',
        enum: setFields,
      },
    },
  },
  required: ['id', 'name', 'userDefined', 'fields'],
};
