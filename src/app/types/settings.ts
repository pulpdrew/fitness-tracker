import { WeightUnit } from './workout';

export interface Settings {
  id: string;
  defaultWeightUnit: WeightUnit;
}

export function getDefaultSettings(): Settings {
  return {
    id: '0',
    defaultWeightUnit: WeightUnit.KG,
  };
}
