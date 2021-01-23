import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Dump } from './dump';
import { ExerciseType } from './exercise-type';
import { ApplicationSettings } from './settings';
import { Workout } from './workout';

export const DATA_STORE = new InjectionToken<DataStore>('DataStore');

export default interface DataStore {
  /**
   * The exercise types that are stored in the database
   */
  exerciseTypes$: Observable<Map<string, ExerciseType>>;

  /**
   * The completed workouts that are stored in the database
   */
  workouts$: Observable<Workout[]>;

  /**
   * The current settings for this application
   */
  settings$: Observable<ApplicationSettings>;

  /**
   * Upsert the given workout into the database, matching to existing document by id.
   *
   * @param workout the workout to upsert
   */
  upsertWorkout(workout: Workout): Promise<void>;

  /**
   * Delete the given workout from the database, matching by id
   *
   * @param workout the workout to upsert
   */
  deleteWorkout(workout: Workout): Promise<void>;

  /**
   * Upsert the given ExerciseType into the database, matching to existing document by id.
   *
   * @param type the ExerciseType to upsert
   */
  upsertExerciseType(type: ExerciseType): Promise<void>;

  /**
   * Delete the ExerciseType workout from the database, matching by id
   *
   * @param type the ExerciseType to upsert
   */
  deleteExerciseType(type: ExerciseType): Promise<void>;

  /**
   * Export all user data as a Dump.
   */
  exportData(): Promise<Dump>;

  /**
   * Import a dump as user data.
   *
   * @param dump the user data to import.
   */
  importData(dump: Dump): Promise<void>;

  /**
   * Update the user settings with the given ApplicationSettings object.
   *
   * @param settings the new settings.
   */
  updateSettings(settings: ApplicationSettings): Promise<void>;

  /**
   * Clear all data from the data store.
   */
  clear(): Promise<void>;

  /**
   * Get a promise that resolves only once the data store is initialized.
   */
  waitForInit(): Promise<void>;
}
