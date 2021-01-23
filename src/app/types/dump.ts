import { ExerciseTypeDataV1 } from './exercise-type';
import { ApplicationSettingsDataV1 } from './settings';
import { WorkoutDataV1 } from './workout';

/**
 * The possible versions of a Dump.
 */
export enum DumpVersion {
  V1 = '1',
}

/**
 * A Dump of all of the user data stored in the application.
 */
export interface Dump {
  version: DumpVersion;
}

/**
 * The current Dump interface
 */
export type CurrentDump = DumpV1;

/**
 * Version 1 of Dump
 */
export interface DumpV1 extends Dump {
  workouts: WorkoutDataV1[];
  types: ExerciseTypeDataV1[];
  settings: ApplicationSettingsDataV1;
}

/**
 * A function that updates a dump to a newer DumpVersion.
 */
type Migration = (dump: Dump) => Dump;

/**
 * The current DumpVersion
 */
export const currentDumpVersion: DumpVersion = DumpVersion.V1;

/**
 * A map from each DumpVersion to the migration that updates a
 * Dump of that DumpVersion to the next DumpVersion.
 */
const migrations: Map<DumpVersion, Migration> = new Map([]);

/**
 * Updates a Dump to the most recent DumpVersion by running consecutive
 * migrations on the dump until it is updated completely.
 *
 * @param dump the dump to migrate
 */
export function migrate(dump: Dump): Dump {
  while (dump.version != currentDumpVersion) {
    const migration = migrations.get(dump.version);
    if (migration) {
      dump = migration(dump);
    } else {
      throw `Missing migration for dump version ${dump.version}`;
    }
  }

  return dump;
}
