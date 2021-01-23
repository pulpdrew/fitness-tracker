import { Inject, Injectable } from '@angular/core';
import { concat, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import { ApplicationSettings, DEFAULT_WEIGHT_UNIT } from '../types/settings';
import { WeightUnit } from '../types/weight';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings$ = concat(of(ApplicationSettings.default()), this.data.settings$);

  defaultWeightUnit: WeightUnit = ApplicationSettings.default()[
    DEFAULT_WEIGHT_UNIT
  ];
  defaultWeightUnit$ = this.settings$.pipe(map((s) => s.defaultWeightUnit));

  constructor(@Inject(DATA_STORE) private data: DataStore) {
    this.defaultWeightUnit$.subscribe(
      (unit) => (this.defaultWeightUnit = unit)
    );
  }

  async setDefaultWeightUnit(unit: WeightUnit): Promise<void> {
    const currentSettings = await this.settings$.pipe(take(1)).toPromise();
    await this.data.updateSettings(
      new ApplicationSettings({
        ...currentSettings.data,
        defaultWeightUnit: unit,
      })
    );
  }
}
