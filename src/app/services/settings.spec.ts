import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import MockDataStore, {
  types as mockTypeData,
  workoutA,
  workoutB,
} from '../mocks/mock-data-store';
import { DATA_STORE } from '../types/data-store';
import { DumpVersion } from '../types/dump';
import {
  ApplicationSettings,
  ApplicationSettingsData,
} from '../types/settings';
import { WeightUnit } from '../types/weight';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let mockDataStore: MockDataStore;

  function configure(settings: ApplicationSettingsData) {
    const mockTypes = cold('a', { a: mockTypeData });
    const mockWorkouts = cold('a', { a: [workoutA, workoutB] });

    mockDataStore = new MockDataStore(
      mockTypes,
      mockWorkouts,
      cold('a', { a: new ApplicationSettings(settings) })
    );

    TestBed.configureTestingModule({
      providers: [
        {
          provide: DATA_STORE,
          useValue: mockDataStore,
        },
      ],
    });

    service = TestBed.inject(SettingsService);
  }

  describe('with non-default settings', () => {
    beforeEach(() => {
      configure({
        currentDumpVersion: DumpVersion.V1,
        defaultWeightUnit: WeightUnit.LB,
        hasSeenWelcomeScreen: true,
      });
    });

    it('should have settings', () => {
      expect(service.settings$).toBeObservable(
        cold('a', {
          a: jasmine.objectContaining({
            currentDumpVersion: DumpVersion.V1,
            defaultWeightUnit: WeightUnit.LB,
            hasSeenWelcomeScreen: true,
          }),
        })
      );
    });

    it('should set default weight unit in data store', async () => {
      await service.setDefaultWeightUnit(WeightUnit.KG);
      expect(mockDataStore.updateSettings).toHaveBeenCalledWith(
        jasmine.objectContaining({ defaultWeightUnit: WeightUnit.KG })
      );
    });

    it('should have observable defaultWeightUnit', () => {
      expect(service.defaultWeightUnit$).toBeObservable(
        cold('a', { a: WeightUnit.LB })
      );
    });

    it('should set hasSeenWelcomeScreen in data store', async () => {
      await service.setHasSeenWelcomeScreen(true);
      expect(mockDataStore.updateSettings).toHaveBeenCalledWith(
        jasmine.objectContaining({ hasSeenWelcomeScreen: true })
      );
    });

    it('should have observable hasSeenWelcomeScreen', () => {
      expect(service.hasSeenWelcomeScreen$).toBeObservable(
        cold('a', { a: true })
      );
    });
  });

  describe('with undefined hasSeenWelcomeScreen', () => {
    it('should not emit hasSeenWelcomeScreen', () => {
      configure({
        currentDumpVersion: DumpVersion.V1,
        defaultWeightUnit: WeightUnit.KG,
      });
      expect(service.hasSeenWelcomeScreen$).toBeObservable(cold(''));
    });
  });
});
