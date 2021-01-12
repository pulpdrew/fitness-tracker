import LocalForageService from './local-forage.service';
import { cold } from 'jasmine-marbles';
import { ExerciseCategory, ExerciseType } from '../types/exercise-type';
import { SetField } from '../types/workout';

fdescribe('NgForageService', () => {
  let service: LocalForageService;

  beforeEach(async () => {
    service = new LocalForageService();
    await service.clear();
  }, 1000);

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  describe('Exercise Types', () => {
    const typeA: ExerciseType = {
      id: '1',
      name: 'A',
      categories: [ExerciseCategory.ABS],
      fields: [SetField.DURATION],
      userDefined: true,
    };

    const typeAPrime: ExerciseType = {
      ...typeA,
      name: 'A-Prime',
      categories: [ExerciseCategory.BACK],
      fields: [SetField.WEIGHT, SetField.WEIGHT_UNITS],
    };

    const typeB: ExerciseType = {
      ...typeA,
      id: '2',
      name: 'B',
    };

    it('should start with an empty list', () => {
      const expected = cold('a', {
        a: [],
      });

      const actual = service.exerciseTypes$;
      expect(actual).toBeObservable(expected);
    });

    it('should insert an exercise type that does not yet exist', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: [typeA],
      });

      await service.upsertExerciseType(typeA);
      expect(actual).toBeObservable(expected);
    });

    it('should update an exercise type that already exists', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: [typeAPrime],
      });

      await service.upsertExerciseType(typeA);
      await service.upsertExerciseType(typeAPrime);
      expect(actual).toBeObservable(expected);
    });

    it('should offer exercise types in alphabretical order by name', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: [typeA, typeB],
      });

      await service.upsertExerciseType(typeB);
      await service.upsertExerciseType(typeA);
      expect(actual).toBeObservable(expected);
    });

    it('should remove an exercise type', async () => {
      const actual = service.exerciseTypes$;
      const expected = cold('a', {
        a: [typeB],
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
        a: [typeA, typeB],
      });

      expect(actual).toBeObservable(expected);
    });
  });
});
