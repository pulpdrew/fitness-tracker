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
import { exerciseTypeSchema } from '../schemas/exercise-type.schema';
import { ExerciseType } from '../types/exercise-type';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type ExerciseTypeDoc = RxDocument<ExerciseType, unknown>;
type WorkoutDoc = RxDocument<Workout, unknown>;

type WorkoutCollection = RxCollection<Workout, unknown, unknown>;
type ExerciseTypeCollection = RxCollection<ExerciseType, unknown, unknown>;

type Collections = {
  workouts: WorkoutCollection;
  exercises: ExerciseTypeCollection;
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

  async saveExerciseType(type: ExerciseType): Promise<void> {
    this._db$.subscribe((db) => db.exercises.upsert(type));
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    this._db$.subscribe((db) => db.exercises.findOne(type.id).remove());
  }
}
