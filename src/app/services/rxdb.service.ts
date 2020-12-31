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

import { combineLatest, from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Workout } from '../types/workout';
import { emptyExerciseType, ExerciseType } from '../types/exercise-type';
import { Settings, getDefaultSettings } from '../types/settings';

import { WorkoutDocument, workoutSchema } from '../rxdb/workout.schema';
import { settingsSchema } from '../rxdb/settings.schema';
import { exerciseTypeSchema } from '../rxdb/exercise-type.schema';
import DataSource from '../types/data-source';

type WorkoutCollection = RxCollection<WorkoutDocument, unknown, unknown>;
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
export class RxdbService implements DataSource {
  /**
   * Database that is guaranteed to be initialized
   */
  private _db$: Observable<Database>;

  /**
   * Raw workout documents from the database
   */
  private _workouts$: Observable<WorkoutDocument[]>;

  exerciseTypes$: Observable<ExerciseType[]>;
  workouts$: Observable<Workout[]>;
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
    this._workouts$ = this._db$.pipe(
      switchMap((db) =>
        db.workouts
          .find()
          .$.pipe(
            map((docs) => docs.map((doc) => this.projectWorkoutDocument(doc)))
          )
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

    // Join the raw workouts and the exercise types
    this.workouts$ = combineLatest([this._workouts$, this.exerciseTypes$]).pipe(
      map(([workouts, types]) => this.join(workouts, types))
    );
  }

  async upsertWorkout(workout: Workout): Promise<void> {
    const db = await this.getDatabase();
    await db.workouts.upsert(this.toWorkoutDocument(workout));
  }

  async deleteWorkout(workout: Workout): Promise<void> {
    const db = await this.getDatabase();
    await db.workouts.findOne(workout.id).remove();
  }

  async upsertExerciseType(type: ExerciseType): Promise<void> {
    const db = await this.getDatabase();
    await db.exercises.upsert(type);
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    const db = await this.getDatabase();
    await db.exercises.findOne(type.id).remove();
  }

  async exportData(): Promise<string> {
    const db = await this.getDatabase();
    const dump = await db.dump();
    return JSON.stringify(dump);
  }

  async importData(json: string): Promise<void> {
    const db = await this.getDatabase();
    await db.importDump(JSON.parse(json) as RxDumpDatabase<Collections>);
  }

  async updateSettings(settings: Settings): Promise<void> {
    const db = await this.getDatabase();
    await db.settings.upsert(settings);
  }

  /**
   * Get the current database instance
   */
  private async getDatabase(): Promise<Database> {
    return this._db$.pipe(take(1)).toPromise();
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
   * Projects only the WorkoutDocument properties from a given RxDocument<WorkoutDocument>
   *
   * @param document the RxDocument representing the raw WorkoutDocument object
   */
  private projectWorkoutDocument(
    document: RxDocument<WorkoutDocument, unknown>
  ): WorkoutDocument {
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
  private projectSettings(document: RxDocument<Settings, unknown>): Settings {
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
  private projectExerciseType(
    document: RxDocument<ExerciseType, unknown>
  ): ExerciseType {
    return {
      id: document.id,
      fields: document.fields,
      userDefined: document.userDefined,
      name: document.name,
      categories: document.categories,
    };
  }

  /**
   * Convert the given workout to a Workout Document.
   *
   * @param workout the Workout to convert
   */
  private toWorkoutDocument(workout: Workout): WorkoutDocument {
    return {
      date: workout.date.toUTCString(),
      id: workout.id,
      name: workout.name,
      exercises: workout.exercises.map((e) => ({
        sets: e.sets,
        type: e.type.id,
      })),
    };
  }

  /**
   * Joins the given WorkoutDocuments with the given ExerciseTypes.
   *
   * @param workouts The raw workout documents with a foreign key into Exercise Types
   * @param types The exercise type documents
   */
  private join(workouts: WorkoutDocument[], types: ExerciseType[]): Workout[] {
    return workouts.map((wDoc) => ({
      date: new Date(wDoc.date),
      id: wDoc.id,
      name: wDoc.name,
      exercises: wDoc.exercises.map((eDoc) => ({
        sets: eDoc.sets,
        type: types.find((t) => t.id === eDoc.type) || emptyExerciseType(),
      })),
    }));
  }
}
