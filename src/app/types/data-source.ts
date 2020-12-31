import { Observable } from 'rxjs';
import { ExerciseType } from './exercise-type';
import { Settings } from './settings';
import { Workout } from './workout';

export default interface DataSource {
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
   * Export all user data as a JSON string.
   */
  exportData(): Promise<string>;

  /**
   * Import a json string as user data.
   *
   * @param json the user data to import.
   */
  importData(json: string): Promise<void>;

  /**
   * Update the user settings with the given Settings object.
   *
   * @param settings the new settings.
   */
  updateSettings(settings: Settings): Promise<void>;
}
