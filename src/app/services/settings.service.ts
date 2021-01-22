import { Inject, Injectable } from '@angular/core';
import { concat, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import { ApplicationSettings } from '../types/settings';
import { WeightUnit } from '../types/weight';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings$ = concat(of(ApplicationSettings.default()), this.data.settings$);

  defaultWeightUnit: WeightUnit = WeightUnit.KG;
  defaultWeightUnit$ = this.settings$.pipe(map((s) => s.defaultWeightUnit));

  constructor(@Inject(DATA_STORE) private data: DataStore) {
    this.defaultWeightUnit$.subscribe(
      (unit) => (this.defaultWeightUnit = unit)
    );
  }

  async setDefaultWeightUnit(unit: WeightUnit): Promise<void> {
    const currentSettings = await this.settings$.pipe(take(1)).toPromise();
    await this.data.updateSettings({
      ...currentSettings,
      defaultWeightUnit: unit,
    });
  }
}
