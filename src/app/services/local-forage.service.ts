import { combineLatest, Observable } from 'rxjs';
import { ExerciseType, ExerciseTypeData, ID } from '../types/exercise-type';
import {
  ApplicationSettings,
  ApplicationSettingsData,
  CURRENT_DUMP_VERSION,
} from '../types/settings';
import { Workout, WorkoutData } from '../types/workout';
import { map } from 'rxjs/operators';
import DataStore from '../types/data-store';
import { environment } from 'src/environments/environment';
import { CurrentDump, Dump, migrate } from '../types/dump';
import { CachedKVStore } from '../types/kv-store';

const EXERCISE_TYPE_INSTANCE_NAME = environment.dbNamePrefix + 'ExerciseTypes';
const WORKOUT_INSTANCE_NAME = environment.dbNamePrefix + 'Workouts';
const SETTINGS_INSTANCE_NAME = environment.dbNamePrefix + 'ApplicationSettings';
const SETTINGS_ID = '0';

export default class LocalForageService implements DataStore {
  readonly exerciseTypes$: Observable<Map<string, ExerciseType>>;
  readonly workouts$: Observable<Workout[]>;
  readonly settings$: Observable<ApplicationSettings>;
  readonly waitForInit: Promise<void>;

  /**
   * The CachedKVStore that holds ExerciseTypeData
   */
  private readonly _dbExerciseTypes: CachedKVStore<ExerciseTypeData>;

  /**
   * The CachedKVStore that holds ApplicationSettingsData
   */
  private readonly _dbSettings: CachedKVStore<ApplicationSettingsData>;

  /**
   * The CachedKVStore that holds WorkoutData
   */
  private readonly _dbWorkouts: CachedKVStore<WorkoutData>;

  constructor() {
    // Create the CachedKVStore Instances.
    this._dbExerciseTypes = new CachedKVStore(EXERCISE_TYPE_INSTANCE_NAME);
    this._dbSettings = new CachedKVStore(SETTINGS_INSTANCE_NAME);
    this._dbWorkouts = new CachedKVStore(WORKOUT_INSTANCE_NAME);

    // Initialize the public observables
    this.settings$ = this._dbSettings.cache$.pipe(
      map(
        (settings) =>
          new ApplicationSettings(
            settings[0] || ApplicationSettings.default().data
          )
      )
    );

    this.exerciseTypes$ = this._dbExerciseTypes.cache$.pipe(
      map(
        (types) =>
          new Map(types.map((type) => [type[ID], new ExerciseType(type)]))
      )
    );

    this.workouts$ = combineLatest([
      this._dbWorkouts.cache$,
      this.exerciseTypes$,
    ]).pipe(
      map(([workouts, types]) => workouts.map((w) => new Workout(w, types))),
      map((workouts) => workouts.sort(Workout.chronological))
    );

    this.waitForInit = new Promise((resolve) =>
      this.init().then(() => resolve())
    );
  }

  private async init(): Promise<void> {
    // Wait for each KV Store to initialize.
    await Promise.all([
      this._dbExerciseTypes.waitForInit,
      this._dbSettings.waitForInit,
      this._dbWorkouts.waitForInit,
    ]);

    // Export and import to run any migrations
    const dump = await this._getDump();
    await this._clear();
    await this._insertDump(dump);
  }

  async upsertWorkout(workout: Workout): Promise<void> {
    try {
      await this.waitForInit;
      await this._dbWorkouts.upsert(workout.id, workout.data);
    } catch (err) {
      console.error('Error upserting workout: ' + err);
    }
  }

  async deleteWorkout(workout: Workout): Promise<void> {
    try {
      await this.waitForInit;
      await this._dbWorkouts.remove(workout.id);
    } catch (err) {
      console.error('Error deleting workout: ' + err);
    }
  }

  async upsertExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit;
      await this._dbExerciseTypes.upsert(type[ID], type.data);
    } catch (err) {
      console.error('Error upserting exercise type: ' + err);
    }
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit;
      await this._dbExerciseTypes.remove(type.id);
    } catch (err) {
      console.error('Error deleting exercise type: ' + err);
    }
  }

  async exportData(): Promise<Dump> {
    await this.waitForInit;
    return await this._getDump();
  }

  async importData(dump: Dump): Promise<void> {
    await this.waitForInit;
    await this._clear();
    await this._insertDump(dump);
  }

  async upsertSettings(settings: ApplicationSettings): Promise<void> {
    try {
      await this.waitForInit;
      await this._dbSettings.upsert(SETTINGS_ID, settings.data);
    } catch (err) {
      console.error('Error updating settings: ' + err);
    }
  }

  async clear(): Promise<void> {
    await this.waitForInit;
    await this._clear();
  }

  private async _clear(): Promise<void> {
    await Promise.all([
      this._dbExerciseTypes.clear(),
      this._dbSettings.clear(),
      this._dbWorkouts.clear(),
    ]);
  }

  private async _insertDump(dump: Dump): Promise<void> {
    // Update dump to the latest version
    let updatedDump: CurrentDump;
    try {
      updatedDump = migrate(dump) as CurrentDump;
    } catch (err) {
      console.error(err);
      return;
    }

    await Promise.all([
      this._dbSettings.upsert(SETTINGS_ID, updatedDump.settings),
      this._dbExerciseTypes.upsertAll(updatedDump.types.map((t) => [t[ID], t])),
      this._dbWorkouts.upsertAll(updatedDump.workouts.map((w) => [w[ID], w])),
    ]);
  }

  /**
   * Get a dump of the current state of the LocalForage database
   */
  private async _getDump(): Promise<Dump> {
    const settings = {
      ...ApplicationSettings.default().data,
      ...(await this._dbSettings.get(SETTINGS_ID)),
    };

    const dump: CurrentDump = {
      version: settings[CURRENT_DUMP_VERSION],
      workouts: (await this._dbWorkouts.items()) || [],
      types: (await this._dbExerciseTypes.items()) || [],
      settings: settings,
    };

    return dump;
  }
}
