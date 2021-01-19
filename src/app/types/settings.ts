import { WeightUnit } from './weight';

export interface Settings {
  defaultWeightUnit: WeightUnit;
}

export function getDefaultSettings(): Settings {
  return {
    defaultWeightUnit: WeightUnit.KG,
  };
}
