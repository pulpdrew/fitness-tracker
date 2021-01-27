import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import DataStore from '../types/data-store';
import { DURATION, REPS, WEIGHT, WEIGHT_UNITS } from '../types/exercise-set';
import { ExerciseCategory, ExerciseType } from '../types/exercise-type';
import { ApplicationSettings } from '../types/settings';
import { WeightUnit } from '../types/weight';
import { Workout } from '../types/workout';

export default class MockDataStore implements DataStore {
  constructor(
    public exerciseTypes$: Observable<Map<string, ExerciseType>>,
    public workouts$: Observable<Workout[]>,
    public settings$: Observable<ApplicationSettings> = cold('a', {
      a: ApplicationSettings.default(),
    })
  ) {}

  waitForInit = Promise.resolve();

  upsertWorkout = jasmine.createSpy('upsertWorkout');
  deleteWorkout = jasmine.createSpy('deleteWorkout');
  upsertExerciseType = jasmine.createSpy('upsertExerciseType');
  deleteExerciseType = jasmine.createSpy('deleteExerciseType');
  exportData = jasmine.createSpy('exportData');
  importData = jasmine.createSpy('importData');
  upsertSettings = jasmine.createSpy('updateSettings');
  clear = jasmine.createSpy('clear');
}

export const plank = new ExerciseType({
  categories: [ExerciseCategory.ABS],
  fields: [DURATION],
  id: 'A',
  name: 'Plank',
});

export const shoulderPress = new ExerciseType({
  id: 'B',
  name: 'Shoulder Press',
  categories: [ExerciseCategory.SHOULDERS],
  fields: [REPS, WEIGHT, WEIGHT_UNITS],
});

export const pushups = new ExerciseType({
  id: 'C',
  name: 'Pushups',
  categories: [ExerciseCategory.CHEST],
  fields: [REPS],
});

export const tricep = new ExerciseType({
  id: 'D',
  name: 'Tricep Curls',
  categories: [ExerciseCategory.TRICEPS],
  fields: [REPS],
});

export const types = new Map([
  [tricep.id, tricep],
  [pushups.id, pushups],
  [shoulderPress.id, shoulderPress],
  [plank.id, plank],
]);

export const workoutA: Workout = new Workout(
  {
    date: new Date('2020-01-01 00:00:00').toISOString(),
    id: 'A',
    name: 'Workout A',
    exercises: [
      {
        typeId: shoulderPress.id,
        sets: [
          {
            reps: 10,
            weight: 11,
            weightUnits: WeightUnit.KG,
          },
          {
            reps: 11,
            weight: 22,
            weightUnits: WeightUnit.LB,
          },
        ],
      },
      {
        typeId: plank.id,
        sets: [
          {
            duration: 102,
          },
          {
            duration: 103,
          },
        ],
      },
      {
        typeId: pushups.id,
        sets: [
          {
            reps: 104,
          },
        ],
      },
      {
        typeId: pushups.id,
        sets: [
          {
            reps: 104,
          },
        ],
      },
    ],
  },
  types
);

export const workoutB: Workout = new Workout(
  {
    date: new Date('2020-01-02 00:00:00').toISOString(),
    id: 'B',
    name: 'Workout B',
    exercises: [
      {
        typeId: shoulderPress.id,
        sets: [
          {
            reps: 12,
            weight: 44,
            weightUnits: WeightUnit.LB,
          },
          {
            reps: 13,
            weight: 10,
            weightUnits: WeightUnit.KG,
          },
        ],
      },
      {
        typeId: pushups.id,
        sets: [
          {
            reps: 104,
          },
        ],
      },
    ],
  },
  types
);
