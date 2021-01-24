import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { map } from 'rxjs/operators';
import MockDataStore, {
  plank,
  pushups,
  shoulderPress,
  tricep,
  workoutA,
  workoutB,
} from '../mocks/mock-data-store';
import { DATA_STORE } from '../types/data-store';
import { ExerciseType } from '../types/exercise-type';
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
