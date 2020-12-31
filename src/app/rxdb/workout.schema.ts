import { JsonSchema, RxJsonSchema } from 'rxdb';
import { ExerciseSet, weightUnits } from '../types/workout';

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

export interface ExerciseDocument {
  type: string;
  sets: ExerciseSet[];
}

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

export interface WorkoutDocument {
  id: string;
  name: string;
  date: string;
  exercises: ExerciseDocument[];
}

export const workoutSchema: RxJsonSchema<WorkoutDocument> = {
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
