import { currentDumpVersion, DumpVersion } from './dump';
import { WeightUnit } from './weight';

export const DEFAULT_WEIGHT_UNIT = 'defaultWeightUnit';
export const CURRENT_DUMP_VERSION = 'currentDumpVersion';

/**
 * Represents the current application settings
 */
export class ApplicationSettings {
  public readonly [DEFAULT_WEIGHT_UNIT]: WeightUnit;
  public readonly [CURRENT_DUMP_VERSION]: DumpVersion;

  constructor(public readonly data: ApplicationSettingsData) {
    this[DEFAULT_WEIGHT_UNIT] = data[DEFAULT_WEIGHT_UNIT];
    this[CURRENT_DUMP_VERSION] = data[CURRENT_DUMP_VERSION];
  }

  static default(): ApplicationSettings {
    return new ApplicationSettings({
      [DEFAULT_WEIGHT_UNIT]: WeightUnit.KG,
      [CURRENT_DUMP_VERSION]: currentDumpVersion,
    });
  }
}

/**
 * The most recent version of SettingsData, used by the ApplicationSettings Object
 */
export type ApplicationSettingsData = ApplicationSettingsDataV1;

/**
 * Version 1 of the serializable data held by a singe ApplicationSettings instance
 */
export interface ApplicationSettingsDataV1 {
  [DEFAULT_WEIGHT_UNIT]: WeightUnit;
  [CURRENT_DUMP_VERSION]: DumpVersion;
}
