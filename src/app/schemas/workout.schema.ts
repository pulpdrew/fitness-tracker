import { JsonSchema, RxJsonSchema } from 'rxdb';
import { Workout } from '../types/workout';

const setSchema: JsonSchema = {
  type: 'object',
  properties: {
    weight: {
      type: 'number',
    },
    weightUnits: {
      type: 'string',
      enum: ['kg', 'lb'],
    },
    reps: {
      type: 'number',
    },
    time: {
      type: 'number',
    },
  },
};

const exerciseSchema: JsonSchema = {
  type: 'object',
  required: ['templateId', 'sets'],
  properties: {
    templateId: {
      type: 'string',
    },
    sets: {
      type: 'array',
      items: setSchema,
    },
  },
};

const workoutSchema: RxJsonSchema<Workout> = {
  version: 0,
  title: 'workout schema',
  description: '',
  type: 'object',
  properties: {
    id: {
      primary: true,
      type: 'string',
    },
    exercises: {
      type: 'array',
      items: exerciseSchema,
    },
    date: {
      type: 'string',
    },
  },
  required: ['id', 'exercises', 'date'],
  indexes: ['exercises.[].templateId'],
};

export default workoutSchema;
