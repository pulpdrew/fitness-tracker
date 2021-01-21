import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ExerciseType, ExerciseTypeData, ID } from '../types/exercise-type';
import { getDefaultSettings, Settings } from '../types/settings';
import { Workout, WorkoutData } from '../types/workout';
import localforage from 'localforage';
import { filter, map, take } from 'rxjs/operators';
import DataStore from '../types/data-store';
import { environment } from 'src/environments/environment';

interface Dump {
  workouts: WorkoutData[];
  types: ExerciseTypeData[];
  settings: Settings;
}

const EXERCISE_TYPE_INSTANCE_NAME = environment.dbNamePrefix + 'ExerciseTypes';
const WORKOUT_INSTANCE_NAME = environment.dbNamePrefix + 'Workouts';
const SETTINGS_INSTANCE_NAME = environment.dbNamePrefix + 'Settings';

export default class LocalForageService implements DataStore {
  private readonly _isInitialized$: BehaviorSubject<boolean>;
  private readonly _exerciseTypes$: BehaviorSubject<ExerciseTypeData[]>;
  private readonly _workouts$: BehaviorSubject<WorkoutData[]>;
  private readonly _settings$: BehaviorSubject<Settings>;

  readonly exerciseTypes$: Observable<Map<string, ExerciseType>>;
  readonly workouts$: Observable<Workout[]>;
  readonly settings$: Observable<Settings>;

  /**
   * The LocalForage Instance that holds Exercise Types
   */
  private _dbExerciseTypes: LocalForage;

  /**
   * The LocalForage Instance that holds Application Settings
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
    this._settings$ = new BehaviorSubject(getDefaultSettings());

    // Initialize the public observables
    this.settings$ = this._settings$.asObservable();
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
      map(([workouts, types]) => workouts.map((w) => this.toWorkout(w, types))),
      map((workouts) =>
        workouts.sort((a, b) => a.date.getTime() - b.date.getTime())
      )
    );

    // Initialize the service
    this.init().then(() => {
      this._isInitialized$.next(true);
    });
  }

  private async init(): Promise<void> {
    await Promise.all([
      this.loadExerciseTypes(),
      this.loadWorkouts(),
      this.loadSettings(),
    ]);
  }

  async upsertWorkout(workout: Workout): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbWorkouts.setItem(
        workout.id,
        this.toPersistentWorkout(workout)
      );
      await this.loadWorkouts();
    } catch (err) {
      console.error('Error upserting workout: ' + err);
    }
  }

  async deleteWorkout(workout: Workout): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbWorkouts.removeItem(workout.id);
      await this.loadWorkouts();
    } catch (err) {
      console.error('Error deleting workout: ' + err);
    }
  }

  async upsertExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbExerciseTypes.setItem(type.id, type.data);
      await this.loadExerciseTypes();
    } catch (err) {
      console.error('Error upserting exercise type: ' + err);
    }
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit();
      await this._dbExerciseTypes.removeItem(type.id);
      await this.loadExerciseTypes();
    } catch (err) {
      console.error('Error deleting exercise type: ' + err);
    }
  }

  async exportData(): Promise<string> {
    await this.waitForInit();

    const dump: Dump = {
      settings: this._settings$.value,
      workouts: this._workouts$.value,
      types: this._exerciseTypes$.value,
    };

    return JSON.stringify(dump);
  }

  async importData(json: string): Promise<void> {
    await this.waitForInit();
    await this.clear();

    let dump: Dump = {
      types: [],
      workouts: [],
      settings: getDefaultSettings(),
    };

    try {
      dump = JSON.parse(json);
    } catch (err) {
      console.error('Failed to parse the import file: ' + err);
    }

    await Promise.all([
      this.updateSettings(dump.settings),
      Promise.all(
        dump.types.map((type) => this._dbExerciseTypes.setItem(type.id, type))
      ),
      Promise.all(
        dump.workouts.map((workout) =>
          this._dbWorkouts.setItem(workout.id, workout)
        )
      ),
    ]);

    await Promise.all([
      this.loadExerciseTypes(),
      this.loadSettings(),
      this.loadWorkouts(),
    ]);
  }

  async updateSettings(settings: Settings): Promise<void> {
    try {
      await this.waitForInit();
      await Promise.all(
        Object.entries(settings).map((prop) =>
          this._dbSettings.setItem(prop[0], prop[1])
        )
      );
      await this.loadSettings();
    } catch (err) {
      console.error('Error updating settings: ' + err);
    }
  }

  async clear(): Promise<void> {
    await this.waitForInit();
    await Promise.all([
      this._dbExerciseTypes.clear(),
      this._dbSettings.clear(),
      this._dbWorkouts.clear(),
    ]);
    await Promise.all([
      this.loadExerciseTypes(),
      this.loadSettings(),
      this.loadWorkouts(),
    ]);
  }

  async waitForInit(): Promise<void> {
    await this._isInitialized$
      .asObservable()
      .pipe(
        filter((init) => !!init),
        take(1)
      )
      .toPromise();
  }

  private async loadExerciseTypes(): Promise<void> {
    const types: ExerciseTypeData[] = [];
    await this._dbExerciseTypes.iterate((type: ExerciseTypeData) => {
      types.push(type);
    });
    this._exerciseTypes$.next(types);
  }

  private async loadWorkouts(): Promise<void> {
    const workouts: WorkoutData[] = [];
    await this._dbWorkouts.iterate((workout: WorkoutData) => {
      workouts.push(workout);
    });
    this._workouts$.next(workouts);
  }

  private async loadSettings(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings: any = getDefaultSettings();
    await this._dbSettings.iterate((val, key: string) => {
      settings[key] = val;
    });
    this._settings$.next(settings as Settings);
  }

  private toWorkout(
    persistent: WorkoutData,
    types: Map<string, ExerciseType>
  ): Workout {
    return new Workout(
      {
        date: persistent.date,
        id: persistent.id,
        name: persistent.name,
        exercises: persistent.exercises,
      },
      types
    );
  }

  private toPersistentWorkout(workout: Workout): WorkoutData {
    return {
      id: workout.id,
      name: workout.name,
      date: workout.date.toISOString(),
      exercises: workout.exercises.map((e) => e.data),
    };
  }
}
