import { Injectable } from '@angular/core';
import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxDocument,
} from 'rxdb';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import * as adapter from 'pouchdb-adapter-indexeddb';
import workoutSchema from '../schemas/workout.schema';
import { Workout } from '../types/workout';

type WorkoutCollection = RxCollection<Workout, unknown, unknown>;
type Collections = {
  workouts: WorkoutCollection;
};
type Database = RxDatabase<Collections>;

@Injectable({
  providedIn: 'root',
})
export class RxdbService {
  db: Database | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    addRxPlugin(adapter);
    addRxPlugin(RxDBValidatePlugin);

    this.db = await createRxDatabase<Collections>({
      name: 'workout',
      adapter: 'indexeddb',
    });

    await this.db.addCollections({
      workouts: {
        schema: workoutSchema,
      },
    });
  }

  async addWorkout(workout: Workout): Promise<RxDocument<Workout, unknown>> {
    return this.db?.workouts.insert(workout) || Promise.reject();
  }

  async printWorkouts(): Promise<void> {
    const docs = await this.db?.workouts.find().exec();
    docs?.forEach((doc) =>
      console.log(
        `Document with ${doc.exercises.length} exercises completed ${doc.date}`
      )
    );
  }
}
