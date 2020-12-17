import { Injectable } from '@angular/core';
import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxDocument,
} from 'rxdb';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import * as IndexedDbAdapter from 'pouchdb-adapter-indexeddb';
import workoutSchema from '../schemas/workout.schema';
import { Workout } from '../types/workout';
import { exerciseTemplateSchema } from '../schemas/exercises.schema';
import { ExerciseTemplate } from '../types/exercise-template';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type ExerciseTemplateDoc = RxDocument<ExerciseTemplate, unknown>;
type WorkoutDoc = RxDocument<Workout, unknown>;

type WorkoutCollection = RxCollection<Workout, unknown, unknown>;
type ExerciseTemplateCollection = RxCollection<
  ExerciseTemplate,
  unknown,
  unknown
>;

type Collections = {
  workouts: WorkoutCollection;
  exercises: ExerciseTemplateCollection;
};

type Database = RxDatabase<Collections>;

@Injectable({
  providedIn: 'root',
})
export class RxdbService {
  /**
   * Current database and whether it is initialized
   */
  // private _rawDb$: Observable<[Database, boolean]>;

  /**
   * Database that is guaranteed to be initialized
   */
  private _db$: Observable<Database>;

  /**
   * The exercise templates that are contained in the database
   */
  exercises$: Observable<ExerciseTemplate[]>;

  workouts$: Observable<Workout[]>;

  constructor() {
    // Add plugins to enable validation and storage in indexed db
    addRxPlugin(IndexedDbAdapter);
    addRxPlugin(RxDBValidatePlugin);

    // Create the database
    const dbPromise: Promise<Database> = createRxDatabase<Collections>({
      name: 'fitnesstracker',
      adapter: 'indexeddb',
    }).then((db) => this.init(db));

    // Initialize the created database
    // this._rawDb$ = from(dbPromise);

    // Filter for initialized databases
    this._db$ = from(dbPromise);

    // Get the exercises from the database
    this.exercises$ = this._db$.pipe(
      switchMap((db) =>
        db.exercises
          .find()
          .$.pipe(
            map((docs) => docs.map((doc) => this.projectExerciseTemplate(doc)))
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
  }

  /**
   * Initializes the given database and returns it
   *
   * @param db the database to initialize
   */
  private async init(db: Database): Promise<Database> {
    // Create the collections
    await db.addCollections({
      workouts: {
        schema: workoutSchema,
      },
      exercises: {
        schema: exerciseTemplateSchema,
      },
    });

    return db;
  }

  private projectWorkout(document: WorkoutDoc): Workout {
    return {
      date: document.date,
      exercises: document.exercises,
      id: document.id,
    };
  }

  private projectExerciseTemplate(
    document: ExerciseTemplateDoc
  ): ExerciseTemplate {
    return {
      id: document.id,
      fields: document.fields,
      userDefined: document.userDefined,
      name: document.name,
    };
  }

  async saveWorkout(workout: Workout): Promise<void> {
    this._db$.subscribe((db) => db.workouts.upsert(workout));
  }

  async saveExerciseTemplate(template: ExerciseTemplate): Promise<void> {
    this._db$.subscribe((db) => db.exercises.upsert(template));
  }

  async deleteExerciseTemplate(template: ExerciseTemplate): Promise<void> {
    this._db$.subscribe((db) => db.exercises.findOne(template.id).remove());
  }
}
