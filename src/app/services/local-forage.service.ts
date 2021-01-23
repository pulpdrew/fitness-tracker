import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ExerciseType, ExerciseTypeData, ID } from '../types/exercise-type';
import {
  ApplicationSettings,
  ApplicationSettingsData,
  CURRENT_DUMP_VERSION,
  DEFAULT_WEIGHT_UNIT,
} from '../types/settings';
import { Workout, WorkoutData } from '../types/workout';
import localforage from 'localforage';
import { filter, map, take } from 'rxjs/operators';
import DataStore from '../types/data-store';
import { environment } from 'src/environments/environment';
import { CurrentDump, Dump, migrate } from '../types/dump';

const EXERCISE_TYPE_INSTANCE_NAME = environment.dbNamePrefix + 'ExerciseTypes';
const WORKOUT_INSTANCE_NAME = environment.dbNamePrefix + 'Workouts';
const SETTINGS_INSTANCE_NAME = environment.dbNamePrefix + 'ApplicationSettings';

export default class LocalForageService implements DataStore {
  private readonly _isInitialized$: BehaviorSubject<boolean>;
  private readonly _exerciseTypes$: BehaviorSubject<ExerciseTypeData[]>;
  private readonly _workouts$: BehaviorSubject<WorkoutData[]>;
  private readonly _settings$: BehaviorSubject<ApplicationSettingsData>;

  readonly exerciseTypes$: Observable<Map<string, ExerciseType>>;
  readonly workouts$: Observable<Workout[]>;
  readonly settings$: Observable<ApplicationSettings>;

  /**
   * The LocalForage Instance that holds Exercise Types
   */
  private _dbExerciseTypes: LocalForage;

  /**
   * The LocalForage Instance that holds Application ApplicationSettings
   */
  private _dbSettings: LocalForage;

  /**
   * The LocalForage Instance that holds SerializedWorkout
   */
  private _dbWorkouts: LocalForage;

  constructor() {
    // Create the Local Forage Instances.
    this._dbExerciseTypes = localforage.createInstance({
      name: EXERCISE_TYPE_INSTANCE_NAME,
    });
    this._dbSettings = localforage.createInstance({
      name: SETTINGS_INSTANCE_NAME,
    });
    this._dbWorkouts = localforage.createInstance({
      name: WORKOUT_INSTANCE_NAME,
    });

    // Initialize behavior subjects caching the local forage data and service state
    this._isInitialized$ = new BehaviorSubject<boolean>(false);
    this._exerciseTypes$ = new BehaviorSubject<ExerciseTypeData[]>([]);
    this._workouts$ = new BehaviorSubject<WorkoutData[]>([]);
    this._settings$ = new BehaviorSubject(ApplicationSettings.default().data);

    // Initialize the public observables
    this.settings$ = this._settings$
      .asObservable()
      .pipe(map((settings) => new ApplicationSettings(settings)));

    this.exerciseTypes$ = this._exerciseTypes$
      .asObservable()
      .pipe(
        map(
          (types) =>
            new Map(types.map((type) => [type[ID], new ExerciseType(type)]))
        )
      );

    this.workouts$ = combineLatest([
      this._workouts$.asObservable(),
      this.exerciseTypes$,
    ]).pipe(
      map(([workouts, types]) => workouts.map((w) => new Workout(w, types))),
      map((workouts) => workouts.sort(Workout.chronological))
    );

    // Initialize the service
    this.init().then(() => {
      this._isInitialized$.next(true);
    });
  }

  private async init(): Promise<void> {
    // Export and import to run any migrations
    const dump = await this._getDump();
    await this._clear();
    await this._insertDump(dump);

    // Then load the data into the local variables
    await this._loadData();
  }

  async upsertWorkout(workout: Workout): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbWorkouts.setItem(workout.id, workout.data);
      this._workouts$.next(await this._loadWorkoutData());
    } catch (err) {
      console.error('Error upserting workout: ' + err);
    }
  }

  async deleteWorkout(workout: Workout): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbWorkouts.removeItem(workout.id);
      this._workouts$.next(await this._loadWorkoutData());
    } catch (err) {
      console.error('Error deleting workout: ' + err);
    }
  }

  async upsertExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbExerciseTypes.setItem(type.id, type.data);
      this._exerciseTypes$.next(await this._loadExerciseTypeData());
    } catch (err) {
      console.error('Error upserting exercise type: ' + err);
    }
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbExerciseTypes.removeItem(type.id);
      this._exerciseTypes$.next(await this._loadExerciseTypeData());
    } catch (err) {
      console.error('Error deleting exercise type: ' + err);
    }
  }

  async exportData(): Promise<Dump> {
    await this.waitForInit();
    return await this._getDump();
  }

  async importData(dump: Dump): Promise<void> {
    await this.waitForInit();
    await this._clear();
    await this._insertDump(dump);
    await this._loadData();
  }

  async updateSettings(settings: ApplicationSettings): Promise<void> {
    try {
      await this.waitForInit();
      await this._storeSettingsData(settings.data);
      this._settings$.next(await this._loadSettingsData());
    } catch (err) {
      console.error('Error updating settings: ' + err);
    }
  }

  async clear(): Promise<void> {
    await this.waitForInit();
    await this._clear();
    await this._loadData();
  }

  /**
   * A promise that resolves when the service is initialized
   */
  async waitForInit(): Promise<void> {
    await this._isInitialized$
      .asObservable()
      .pipe(
        filter((init) => !!init),
        take(1)
      )
      .toPromise();
  }

  /**
   * Get the Workout Data from the LocalForage instance
   */
  private async _loadWorkoutData(): Promise<WorkoutData[]> {
    const workouts: WorkoutData[] = [];
    await this._dbWorkouts.iterate((type: WorkoutData) => {
      workouts.push(type);
    });

    return workouts;
  }

  /**
   * Get the Exercise Type Data from the LocalForage instance
   */
  private async _loadExerciseTypeData(): Promise<ExerciseTypeData[]> {
    const types: ExerciseTypeData[] = [];
    await this._dbExerciseTypes.iterate((type: ExerciseTypeData) => {
      types.push(type);
    });

    return types;
  }

  /**
   * Get the Settings Data from the LocalForage instance
   */
  private async _loadSettingsData(): Promise<ApplicationSettingsData> {
    const defaults = ApplicationSettings.default().data;

    const settings: ApplicationSettingsData = {
      [CURRENT_DUMP_VERSION]:
        (await this._dbSettings.getItem(CURRENT_DUMP_VERSION)) ||
        defaults[CURRENT_DUMP_VERSION],
      [DEFAULT_WEIGHT_UNIT]:
        (await this._dbSettings.getItem(DEFAULT_WEIGHT_UNIT)) ||
        defaults[DEFAULT_WEIGHT_UNIT],
    };

    return settings;
  }

  /**
   * Insert the given data into the Settings LocalForage Instance
   *
   * @param settings the data to store in settings
   */
  private async _storeSettingsData(
    settings: ApplicationSettingsData
  ): Promise<void> {
    await Promise.all([
      this._dbSettings.setItem(
        CURRENT_DUMP_VERSION,
        settings[CURRENT_DUMP_VERSION]
      ),
      this._dbSettings.setItem(
        DEFAULT_WEIGHT_UNIT,
        settings[DEFAULT_WEIGHT_UNIT]
      ),
    ]);
  }

  /**
   * Read all of the data from the LocalForage Instances and
   * insert it into the local variables.
   */
  private async _loadData(): Promise<void> {
    const [types, settings, workouts] = await Promise.all([
      this._loadExerciseTypeData(),
      this._loadSettingsData(),
      this._loadWorkoutData(),
    ]);

    this._settings$.next(settings);
    this._workouts$.next(workouts);
    this._exerciseTypes$.next(types);
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
      this._storeSettingsData(updatedDump.settings),
      Promise.all(
        updatedDump.types.map((type) =>
          this._dbExerciseTypes.setItem(type.id, type)
        )
      ),
      Promise.all(
        updatedDump.workouts.map((workout) =>
          this._dbWorkouts.setItem(workout.id, workout)
        )
      ),
    ]);
  }

  /**
   * Get a dump of the current state of the LocalForage database
   */
  private async _getDump(): Promise<Dump> {
    const settings = {
      ...ApplicationSettings.default().data,
      ...(await this._loadSettingsData()),
    };

    const dump: CurrentDump = {
      version: settings[CURRENT_DUMP_VERSION],
      workouts: (await this._loadWorkoutData()) || [],
      types: (await this._loadExerciseTypeData()) || [],
      settings: settings,
    };

    return dump;
  }
}
