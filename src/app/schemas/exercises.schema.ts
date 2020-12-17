import { RxJsonSchema } from 'rxdb';
import { SetField } from '../types/workout';
import { ExerciseTemplate } from '../types/exercise-template';

/**
 * The schema for the collection of Exercise Templates
 */
export const exerciseTemplateSchema: RxJsonSchema<ExerciseTemplate> = {
  version: 0,
  title: 'exercise template schema',
  description: '',
  type: 'object',
  properties: {
    name: {
      primary: true,
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
        enum: [SetField.REPS, SetField.TIME, SetField.WEIGHT],
      },
      default: [SetField.WEIGHT, SetField.REPS],
    },
  },
  required: ['name', 'userDefined', 'fields'],
};
