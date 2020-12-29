import { Injectable } from '@angular/core';
import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxDocument,
  RxDumpDatabase,
} from 'rxdb';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import * as IndexedDbAdapter from 'pouchdb-adapter-indexeddb';
import workoutSchema from '../schemas/workout.schema';
import { Workout } from '../types/workout';
import { exerciseTypeSchema } from '../schemas/exercise-type.schema';
import { ExerciseType } from '../types/exercise-type';
import { from, Observable } from 'rxjs';
import { first, map, switchMap, take } from 'rxjs/operators';
import { Settings } from '../types/settings';
import { getDefaultSettings } from '../types/settings';
import { settingsSchema } from '../schemas/settings.schema';

type ExerciseTypeDoc = RxDocument<ExerciseType, unknown>;
type WorkoutDoc = RxDocument<Workout, unknown>;
type SettingsDoc = RxDocument<Settings, unknown>;

type WorkoutCollection = RxCollection<Workout, unknown, unknown>;
type ExerciseTypeCollection = RxCollection<ExerciseType, unknown, unknown>;
type SettingsCollection = RxCollection<Settings, unknown, unknown>;

type Collections = {
  workouts: WorkoutCollection;
  exercises: ExerciseTypeCollection;
  settings: SettingsCollection;
};

type Database = RxDatabase<Collections>;

const DATABASE_NAME = 'fitnesstracker';
const ADAPTER_NAME = 'indexeddb';

@Injectable({
  providedIn: 'root',
})
export class RxdbService {
  /**
   * Database that is guaranteed to be initialized
   */
  private _db$: Observable<Database>;

  /**
   * The exercise types that are stored in the database
   */
  exerciseTypes$: Observable<ExerciseType[]>;

  /**
   * The completed workouts that are stored in the database
   */
  workouts$: Observable<Workout[]>;

  /**
   * The current settings for this application
   */
  settings$: Observable<Settings>;

  constructor() {
    // Add plugins to enable validation and storage in indexed db
    addRxPlugin(IndexedDbAdapter);
    addRxPlugin(RxDBValidatePlugin);

    // Create the database
    const dbPromise: Promise<Database> = createRxDatabase<Collections>({
      name: DATABASE_NAME,
      adapter: ADAPTER_NAME,
    }).then((db) => this.init(db));

    // Filter for initialized databases
    this._db$ = from(dbPromise);

    // Get the exercises from the database
    this.exerciseTypes$ = this._db$.pipe(
      switchMap((db) =>
        db.exercises
          .find()
          .$.pipe(
            map((docs) => docs.map((doc) => this.projectExerciseType(doc)))
          )
      )
    );

    // Get the workouts from the database
    this.workouts$ = this._db$.pipe(
      switchMap((db) =>
        db.workouts
          .find()
          .$.pipe(map((docs) => docs.map((doc) => this.projectWorkout(doc))))
      )
    );

    // Get the current settings from the database
    this.settings$ = this._db$.pipe(
      switchMap((db) =>
        db.settings
          .findOne()
          .$.pipe(
            map((doc) =>
              doc ? this.projectSettings(doc!) : getDefaultSettings()
            )
          )
      )
    );
  }

  /**
   * Initializes the given database and returns it
   *
   * @param db the database to initialize
   */
  private async init(db: Database): Promise<Database> {
    await db.addCollections({
      workouts: {
        schema: workoutSchema,
      },
      exercises: {
        schema: exerciseTypeSchema,
      },
      settings: {
        schema: settingsSchema,
      },
    });

    return db;
  }

  /**
   * Projects only the Workout properties from a given RxDocument<Workout>
   *
   * @param document the RxDocument representing the Workout object
   */
  private projectWorkout(document: WorkoutDoc): Workout {
    return {
      name: document.name,
      date: document.date,
      exercises: document.exercises,
      id: document.id,
    };
  }

  /**
   * Projects only the Settings properties from a given RxDocument<Settings>
   *
   * @param document the RxDocument representing the Settings object
   */
  private projectSettings(document: SettingsDoc): Settings {
    return {
      id: document.id,
      defaultWeightUnit: document.defaultWeightUnit,
    };
  }

  /**
   * Projects only the ExerciseType properties from a given RxDocument<ExerciseType>
   *
   * @param document the RxDocument representing the ExerciseType object
   */
  private projectExerciseType(document: ExerciseTypeDoc): ExerciseType {
    return {
      id: document.id,
      fields: document.fields,
      userDefined: document.userDefined,
      name: document.name,
      categories: document.categories,
    };
  }

  async saveWorkout(workout: Workout): Promise<void> {
    this._db$.subscribe((db) => db.workouts.upsert(workout));
  }

  async deleteWorkout(workout: Workout): Promise<void> {
    this._db$
      .pipe(first())
      .subscribe((db) => db.workouts.findOne(workout.id).remove());
  }

  async saveExerciseType(type: ExerciseType): Promise<void> {
    this._db$.pipe(first()).subscribe((db) => db.exercises.upsert(type));
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    this._db$
      .pipe(first())
      .subscribe((db) => db.exercises.findOne(type.id).remove());
  }

  async export(): Promise<string> {
    const db = await this._db$.toPromise();
    const dump = await db.dump();
    return JSON.stringify(dump);
  }

  import(json: string): void {
    this._db$
      .pipe(first())
      .subscribe((db) =>
        db.importDump(JSON.parse(json) as RxDumpDatabase<Collections>)
      );
  }

  async saveSettings(settings: Settings): Promise<void> {
    const db = await this._db$.pipe(take(1)).toPromise();
    await db.settings.upsert(settings);
  }
}
