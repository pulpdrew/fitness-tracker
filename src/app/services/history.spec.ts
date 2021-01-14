import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import DataStore from '../types/data-store';
import { ExerciseType } from '../types/exercise-type';
import { getDefaultSettings } from '../types/settings';
import { Workout } from '../types/workout';
import { HistoryEntry, HistoryService } from './history.service';

describe('HistoryService', () => {
  it('should have empty history when there are no types and no workouts', () => {
    const types: ExerciseType[] = [];
    const workouts: Workout[] = [];
    const { service } = setup(types, workouts);

    const expected = cold('a', { a: new Map() });
    expect(service.history$).toBeObservable(expected);
  });

  it('should have empty history for each exercise when there are no workouts', () => {
    const types: ExerciseType[] = [typeA, typeB, typeC];
    const workouts: Workout[] = [];
    const { service } = setup(types, workouts);

    const expected = cold('a', {
      a: new Map([
        [typeA.id, []],
        [typeB.id, []],
        [typeC.id, []],
      ]),
    });
    expect(service.history$).toBeObservable(expected);
  });

  it('should have history for each type for one workout', () => {
    const types: ExerciseType[] = [typeA, typeB, typeC];
    const workouts: Workout[] = [workoutA];
    const { service } = setup(types, workouts);

    const expected = cold('a', {
      a: new Map<string, HistoryEntry[]>([
        [
          typeA.id,
          [
            {
              workoutDate: workoutA.date,
              workoutID: workoutA.id,
              sets: workoutA.exercises[0].sets,
              type: typeA,
            },
          ],
        ],
        [
          typeB.id,
          [
            {
              workoutDate: workoutA.date,
              workoutID: workoutA.id,
              sets: workoutA.exercises[1].sets,
              type: typeB,
            },
          ],
        ],
        [
          typeC.id,
          [
            {
              workoutDate: workoutA.date,
              workoutID: workoutA.id,
              sets: workoutA.exercises[2].sets,
              type: typeC,
            },
          ],
        ],
      ]),
    });
    expect(service.history$).toBeObservable(expected);
  });

  it('should have history in chronological order', () => {
    const types: ExerciseType[] = [typeA, typeB, typeC];
    const workouts: Workout[] = [workoutA, workoutB];
    const { service } = setup(types, workouts);

    const expected = cold('a', {
      a: new Map([
        [
          typeA.id,
          [
            {
              workoutDate: workoutA.date,
              workoutID: workoutA.id,
              sets: workoutA.exercises[0].sets,
              type: typeA,
            },
            {
              workoutDate: workoutB.date,
              workoutID: workoutB.id,
              sets: workoutB.exercises[0].sets,
              type: typeA,
            },
          ],
        ],
        [
          typeB.id,
          [
            {
              workoutDate: workoutA.date,
              workoutID: workoutA.id,
              sets: workoutA.exercises[1].sets,
              type: typeB,
            },
          ],
        ],
        [
          typeC.id,
          [
            {
              workoutDate: workoutA.date,
              workoutID: workoutA.id,
              sets: workoutA.exercises[2].sets,
              type: typeC,
            },
          ],
        ],
      ]),
    });
    expect(service.history$).toBeObservable(expected);
  });

  it('should have previous sets', () => {
    const types: ExerciseType[] = [typeA, typeB, typeC];
    const workouts: Workout[] = [workoutA, workoutB];
    const { service } = setup(types, workouts);

    const expected = cold('a', {
      a: new Map<string, HistoryEntry>([
        [
          typeA.id,
          {
            sets: workoutB.exercises[0].sets,
            type: typeA,
            workoutDate: workoutB.date,
            workoutID: workoutB.id,
          },
        ],
        [
          typeB.id,
          {
            sets: workoutA.exercises[1].sets,
            type: typeB,
            workoutDate: workoutA.date,
            workoutID: workoutA.id,
          },
        ],
        [
          typeC.id,
          {
            sets: workoutA.exercises[2].sets,
            type: typeC,
            workoutDate: workoutA.date,
            workoutID: workoutA.id,
          },
        ],
      ]),
    });
    expect(service.previous$).toBeObservable(expected);
  });

  it('should have undefined previous sets when type has no history', () => {
    const types: ExerciseType[] = [typeA, typeB, typeC];
    const workouts: Workout[] = [];
    const { service } = setup(types, workouts);

    const expected = cold('a', {
      a: new Map([
        [typeA.id, undefined],
        [typeB.id, undefined],
        [typeC.id, undefined],
      ]),
    });
    expect(service.previous$).toBeObservable(expected);
  });
});

function setup(
  types: ExerciseType[],
  workouts: Workout[]
): { service: HistoryService; data: MockDataStore } {
  const types$ = cold('a', {
    a: new Map(types.map((type) => [type.id, type])),
  });
  const workouts$ = cold('a', { a: workouts });

  const data: MockDataStore = new MockDataStore(types$, workouts$);
  const service: HistoryService = new HistoryService(data);

  return { service, data };
}

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

const typeA: ExerciseType = {
  categories: [],
  fields: [],
  id: 'A',
  name: 'Exercise A',
};

const typeB: ExerciseType = {
  ...typeA,
  id: 'B',
  name: 'Exercise B',
};

const typeC: ExerciseType = {
  ...typeA,
  id: 'C',
  name: 'Exercise C',
};

const workoutA: Workout = {
  date: new Date('2020-01-01 00:00:00'),
  id: 'A',
  name: 'Workout A',
  exercises: [
    {
      type: typeA,
      sets: [
        {
          duration: 100,
        },
        {
          duration: 101,
        },
      ],
    },
    {
      type: typeB,
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
      type: typeC,
      sets: [
        {
          duration: 104,
        },
        {
          duration: 105,
        },
      ],
    },
  ],
};

const workoutB: Workout = {
  date: new Date('2020-01-02 00:00:00'),
  id: 'B',
  name: 'Workout B',
  exercises: [
    {
      type: typeA,
      sets: [
        {
          duration: 106,
        },
        {
          duration: 107,
        },
      ],
    },
    {
      type: typeB,
      sets: [],
    },
  ],
};
