import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import { DURATION, REPS, WEIGHT, WEIGHT_UNITS } from '../types/exercise-set';
import { ExerciseCategory, ExerciseType } from '../types/exercise-type';
import { getDefaultSettings } from '../types/settings';
import { WeightUnit } from '../types/weight';
import { Workout } from '../types/workout';
import { HistoryService } from './history.service';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;

  function configure(types: ExerciseType[], workouts: Workout[]) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DATA_STORE,
          useValue: new MockDataStore(
            cold('a', { a: new Map(types.map((type) => [type.id, type])) }),
            cold('a', { a: workouts })
          ),
        },
        HistoryService,
        StatsService,
      ],
    });

    service = TestBed.inject(StatsService);
  }

  describe('with no types or workouts', () => {
    beforeEach(() => {
      const types: ExerciseType[] = [];
      const workouts: Workout[] = [];
      configure(types, workouts);
    });

    it('should have empty stats', () => {
      const expected = cold('a', {
        a: new Map(),
      });

      expect(service.stats$).toBeObservable(expected);
    });
  });

  describe('with types and workouts', () => {
    beforeEach(() => {
      const types: ExerciseType[] = [pushups, shoulderPress, plank, tricep];
      const workouts: Workout[] = [workoutA, workoutB];
      configure(types, workouts);
    });

    it('should show record of all workouts that contain the exercise', () => {
      const shoulderPressWorkoutIds = service.stats$.pipe(
        map((stats) =>
          stats.get(shoulderPress.id)!.workouts.map((wo) => wo.workoutId)
        )
      );
      const plankWorkoutIds = service.stats$.pipe(
        map((stats) => stats.get(plank.id)!.workouts.map((wo) => wo.workoutId))
      );
      const tricepWorkoutIds = service.stats$.pipe(
        map((stats) => stats.get(tricep.id)!.workouts.map((wo) => wo.workoutId))
      );

      expect(plankWorkoutIds).toBeObservable(cold('a', { a: [workoutA.id] }));
      expect(tricepWorkoutIds).toBeObservable(cold('a', { a: [] }));
      expect(shoulderPressWorkoutIds).toBeObservable(
        cold('a', { a: [workoutA.id, workoutB.id] })
      );
    });

    it('should sets stats as undefined when they are unavailable', () => {
      const pushupStats = service.stats$.pipe(
        map((stats) => stats.get(pushups.id)!)
      );

      expect(pushupStats).toBeObservable(
        cold('a', {
          a: {
            type: pushups,
            workouts: jasmine.arrayContaining([]),
            maxReps: 104,
          },
        })
      );
    });

    it('should have type for typeId that has not been completed', () => {
      const tricepType = service.stats$.pipe(
        map((stats) => stats.get(tricep.id)!.type)
      );
      expect(tricepType).toBeObservable(cold('a', { a: tricep }));
    });

    it('should set the correct workout ids and dates', () => {
      const stats = service.stats$.pipe(
        map((stats) => stats.get(shoulderPress.id)!)
      );

      const ids = stats.pipe(
        map((stats) => stats.workouts.map((wo) => wo.workoutId))
      );
      const dates = stats.pipe(
        map((stats) => stats.workouts.map((wo) => wo.workoutDate))
      );

      expect(stats).toBeTruthy();
      expect(ids).toBeObservable(cold('a', { a: [workoutA.id, workoutB.id] }));
      expect(dates).toBeObservable(
        cold('a', { a: [workoutA.date, workoutB.date] })
      );
    });

    it('should convert all weights to the first weight unit', () => {
      const stats = service.stats$.pipe(
        map((stats) => stats.get(shoulderPress.id)!)
      );
      const topLevelWeightUnits = stats.pipe(map((stats) => stats.weightUnits));
      const topLevelMaxWeight = stats.pipe(map((stats) => stats.maxWeight));

      const maxWeights = stats.pipe(
        map((stats) => stats.workouts.flatMap((wo) => wo.maxWeight))
      );
      const totalWeights = stats.pipe(
        map((stats) => stats.workouts.flatMap((wo) => wo.totalWeight))
      );
      const workoutWeightUnits = stats.pipe(
        map((stats) => stats.workouts.map((wo) => wo.weightUnits))
      );

      expect(stats).toBeTruthy();
      expect(topLevelWeightUnits).toBeObservable(
        cold('a', { a: WeightUnit.KG })
      );
      expect(topLevelMaxWeight).toBeObservable(cold('a', { a: 20.0002 }));

      expect(workoutWeightUnits).toBeObservable(
        cold('a', { a: [WeightUnit.KG, WeightUnit.LB] })
      );
      expect(maxWeights).toBeObservable(cold('a', { a: [11, 44] }));
      expect(totalWeights).toBeObservable(cold('a', { a: [220.0011, 814] }));
    });
  });
});

class MockDataStore implements DataStore {
  settings$ = cold('a', { a: getDefaultSettings() });

  constructor(
    public exerciseTypes$: Observable<Map<string, ExerciseType>>,
    public workouts$: Observable<Workout[]>
  ) {}

  upsertWorkout = jasmine.createSpy('upsertWorkout');
  deleteWorkout = jasmine.createSpy('deleteWorkout');
  upsertExerciseType = jasmine.createSpy('upsertExerciseType');
  deleteExerciseType = jasmine.createSpy('deleteExerciseType');
  exportData = jasmine.createSpy('exportData');
  importData = jasmine.createSpy('importData');
  updateSettings = jasmine.createSpy('updateSettings');
  waitForInit = jasmine.createSpy('waitForInit').and.resolveTo();
  clear = jasmine.createSpy('clear');
}

const plank = new ExerciseType({
  categories: [ExerciseCategory.ABS],
  fields: [DURATION],
  id: 'A',
  name: 'Plank',
});

const shoulderPress = new ExerciseType({
  id: 'B',
  name: 'Shoulder Press',
  categories: [ExerciseCategory.SHOULDERS],
  fields: [REPS, WEIGHT, WEIGHT_UNITS],
});

const pushups = new ExerciseType({
  id: 'C',
  name: 'Pushups',
  categories: [ExerciseCategory.CHEST],
  fields: [REPS],
});

const tricep = new ExerciseType({
  id: 'D',
  name: 'Tricep Curls',
  categories: [ExerciseCategory.TRICEPS],
  fields: [REPS],
});

const types = new Map([
  [tricep.id, tricep],
  [pushups.id, pushups],
  [shoulderPress.id, shoulderPress],
  [plank.id, plank],
]);

const workoutA: Workout = new Workout(
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

const workoutB: Workout = new Workout(
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
