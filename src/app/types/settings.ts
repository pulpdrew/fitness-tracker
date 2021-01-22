import { WeightUnit } from './weight';

export const DEFAULT_WEIGHT_UNIT = 'defaultWeightUnit';

/**
 * Represents the current application settings
 */
export class ApplicationSettings {
  public [DEFAULT_WEIGHT_UNIT]: WeightUnit;

  constructor(public readonly data: ApplicationSettingsData) {
    this[DEFAULT_WEIGHT_UNIT] = data.defaultWeightUnit;
  }

  static default(): ApplicationSettings {
    return new ApplicationSettings({
      defaultWeightUnit: WeightUnit.KG,
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
  defaultWeightUnit: WeightUnit;
}
