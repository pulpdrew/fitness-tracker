import LocalForageService from './local-forage.service';
import { cold } from 'jasmine-marbles';
import { ExerciseCategory, ExerciseType } from '../types/exercise-type';
import { Workout } from '../types/workout';
import { ApplicationSettings } from '../types/settings';
import { DURATION, WEIGHT, WEIGHT_UNITS } from '../types/exercise-set';
import { WeightUnit } from '../types/weight';
import { DumpVersion } from '../types/dump';

describe('LocalForageService', () => {
  let service: LocalForageService;

  beforeEach(async () => {
    service = new LocalForageService();
    await service.waitForInit();
    await service.clear();
  }, 1000);

  afterEach(async () => {
    await service.clear();
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  it('should clear', async () => {
    await service.upsertExerciseType(typeA);
    await service.upsertExerciseType(typeB);
    await service.upsertWorkout(workoutA);
    await service.upsertWorkout(workoutB);
    await service.updateSettings(settings);
    await service.clear();

    const expectedTypes = cold('a', {
      a: new Map(),
    });

    const expectedWorkouts = cold('a', {
      a: [],
    });

    const expectedSettings = cold('a', {
      a: ApplicationSettings.default(),
    });

    expect(service.settings$).toBeObservable(expectedSettings);
    expect(service.exerciseTypes$).toBeObservable(expectedTypes);
    expect(service.workouts$).toBeObservable(expectedWorkouts);
  });

  describe('Exercise Types', () => {
    it('should start with an empty list', () => {
      const expected = cold('a', {
        a: new Map(),
      });

      const actual = service.exerciseTypes$;
      expect(actual).toBeObservable(expected);
    });

    it('should insert an exercise type that does not yet exist', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: new Map([[typeA.id, typeA]]),
      });

      await service.upsertExerciseType(typeA);
      expect(actual).toBeObservable(expected);
    });

    it('should update an exercise type that already exists', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: new Map([[typeAPrime.id, typeAPrime]]),
      });

      await service.upsertExerciseType(typeA);
      await service.upsertExerciseType(typeAPrime);
      expect(actual).toBeObservable(expected);
    });

    it('should contain more than one exercise type', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: new Map([
          [typeA.id, typeA],
          [typeB.id, typeB],
        ]),
      });

      await service.upsertExerciseType(typeB);
      await service.upsertExerciseType(typeA);
      expect(actual).toBeObservable(expected);
    });

    it('should remove an exercise type', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: new Map([[typeB.id, typeB]]),
      });

      await service.upsertExerciseType(typeA);
      await service.upsertExerciseType(typeB);
      await service.deleteExerciseType(typeA);
      expect(actual).toBeObservable(expected);
    });

    it('should persist data between instances', async () => {
      await service.upsertExerciseType(typeA);
      await service.upsertExerciseType(typeB);

      service = new LocalForageService();
      await service.waitForInit();
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: new Map([
          [typeA.id, typeA],
          [typeB.id, typeB],
        ]),
      });

      expect(actual).toBeObservable(expected);
    });
  });

  describe('Workouts', () => {
    beforeEach(async () => {
      await service.upsertExerciseType(typeA);
      await service.upsertExerciseType(typeB);
    });

    it('should start with an empty list', () => {
      const expected = cold('a', {
        a: [],
      });

      const actual = service.workouts$;
      expect(actual).toBeObservable(expected);
    });

    it('should insert a workout that does not yet exist', async () => {
      const actual = service.workouts$;
      const expected = cold('a', {
        a: [workoutA],
      });

      await service.upsertWorkout(workoutA);
      expect(actual).toBeObservable(expected);
    });

    it('should update a workout that already exists', async () => {
      const actual = service.workouts$;
      const expected = cold('a', {
        a: [workoutAPrime],
      });

      await service.upsertWorkout(workoutA);
      await service.upsertWorkout(workoutAPrime);
      expect(actual).toBeObservable(expected);
    });

    it('should offer workouts in chronological order', async () => {
      const actual = service.workouts$;
      const expected = cold('a', {
        a: [workoutA, workoutB],
      });

      await service.upsertWorkout(workoutB);
      await service.upsertWorkout(workoutA);
      expect(actual).toBeObservable(expected);
    });

    it('should remove a workout', async () => {
      const actual = service.workouts$;
      const expected = cold('a', {
        a: [workoutB],
      });

      await service.upsertWorkout(workoutA);
      await service.upsertWorkout(workoutB);
      await service.deleteWorkout(workoutA);
      expect(actual).toBeObservable(expected);
    });

    it('should persist data between instances', async () => {
      await service.upsertWorkout(workoutA);
      await service.upsertWorkout(workoutB);

      service = new LocalForageService();
      await service.waitForInit();
      const actual = service.workouts$;
      const expected = cold('a', {
        a: [workoutA, workoutB],
      });

      expect(actual).toBeObservable(expected);
    });
  });

  describe('ApplicationSettings', () => {
    it('should have defaults', () => {
      const expected = cold('a', {
        a: ApplicationSettings.default(),
      });

      const actual = service.settings$;
      expect(actual).toBeObservable(expected);
    });

    it('should update settings', async () => {
      const actual = service.settings$;
      const expected = cold('a', {
        a: settings,
      });

      await service.updateSettings(settings);

      expect(actual).toBeObservable(expected);
    });

    it('should persist settings', async () => {
      await service.updateSettings(settings);
      service = new LocalForageService();
      await service.waitForInit();

      const actual = service.settings$;
      const expected = cold('a', {
        a: settings,
      });

      expect(actual).toBeObservable(expected);
    });
  });

  it('should export and import', async () => {
    await service.upsertExerciseType(typeA);
    await service.upsertExerciseType(typeB);
    await service.upsertWorkout(workoutA);
    await service.upsertWorkout(workoutB);
    await service.updateSettings(settings);

    const dump = await service.exportData();
    await service.clear();

    await service.importData(dump);

    const expectedTypes = cold('a', {
      a: new Map([
        [typeA.id, typeA],
        [typeB.id, typeB],
      ]),
    });

    const expectedWorkouts = cold('a', {
      a: [workoutA, workoutB],
    });

    const expectedSettings = cold('a', {
      a: settings,
    });

    expect(service.settings$).toBeObservable(expectedSettings);
    expect(service.exerciseTypes$).toBeObservable(expectedTypes);
    expect(service.workouts$).toBeObservable(expectedWorkouts);
  });
});

const typeA = new ExerciseType({
  id: '1',
  name: 'A',
  categories: [ExerciseCategory.ABS],
  fields: [DURATION],
});

const typeAPrime = new ExerciseType({
  ...typeA,
  name: 'A-Prime',
  categories: [ExerciseCategory.BACK],
  fields: [WEIGHT, WEIGHT_UNITS],
});

const typeB = new ExerciseType({
  ...typeA,
  id: '2',
  name: 'B',
});

const types = new Map([
  [typeA.id, typeA],
  [typeB.id, typeB],
]);

const workoutA: Workout = new Workout(
  {
    date: new Date('2000-01-01 00:00:00').toISOString(),
    id: '1',
    name: 'Workout A',
    exercises: [
      {
        typeId: typeA.id,
        sets: [{ duration: 10 }],
      },
      {
        typeId: typeB.id,
        sets: [{ weight: 10, weightUnits: WeightUnit.KG }],
      },
    ],
  },
  types
);

const workoutAPrime: Workout = new Workout(
  {
    ...workoutA.data,
    name: 'Workout A Prime',
    exercises: [
      {
        typeId: typeA.id,
        sets: [{ duration: 12 }, { duration: 12 }],
      },
      {
        typeId: typeB.id,
        sets: [
          { weight: 10, weightUnits: WeightUnit.KG },
          { weight: 12, weightUnits: WeightUnit.LB },
        ],
      },
    ],
  },
  types
);

const workoutB: Workout = new Workout(
  {
    ...workoutAPrime.data,
    date: new Date('2000-01-02 00:00:00').toISOString(),
    id: '2',
    name: 'Workout B',
  },
  types
);

const settings = new ApplicationSettings({
  defaultWeightUnit: WeightUnit.LB,
  currentDumpVersion: DumpVersion.V1,
});
