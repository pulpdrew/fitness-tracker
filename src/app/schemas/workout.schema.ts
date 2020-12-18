import { JsonSchema, RxJsonSchema } from 'rxdb';
import { weightUnits, Workout } from '../types/workout';

const setSchema: JsonSchema = {
  type: 'object',
  properties: {
    weight: {
      type: 'number',
    },
    weightUnits: {
      type: 'string',
      enum: weightUnits,
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
  required: ['type', 'sets'],
  properties: {
    type: {
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
    name: {
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
  required: ['id', 'name', 'exercises', 'date'],
  indexes: ['exercises.[].type'],
};

export default workoutSchema;
