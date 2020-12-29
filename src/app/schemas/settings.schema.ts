import { RxJsonSchema } from 'rxdb';
import { WeightUnit, weightUnits } from '../types/workout';
import { Settings } from '../types/settings';

/**
 * The schema for the collection of Exercise Types
 */
export const settingsSchema: RxJsonSchema<Settings> = {
  version: 0,
  title: 'settings schema',
  description: '',
  type: 'object',
  properties: {
    id: {
      primary: true,
      type: 'string',
      default: '0',
    },
    defaultWeightUnit: {
      type: 'string',
      enum: weightUnits,
      default: WeightUnit.LB,
    },
  },
};
