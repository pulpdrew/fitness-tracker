import { WeightUnit } from './workout';

export interface Settings {
  defaultWeightUnit: WeightUnit;
}

export function getDefaultSettings(): Settings {
  return {
    defaultWeightUnit: WeightUnit.KG,
  };
}
