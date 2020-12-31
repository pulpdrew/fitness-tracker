import { Inject, Injectable } from '@angular/core';
import { concat, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DATA_SOURCE_INJECTION_TOKEN } from '../constants';
import DataSource from '../types/data-source';
import { getDefaultSettings } from '../types/settings';
import { WeightUnit } from '../types/workout';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings$ = concat(of(getDefaultSettings()), this.data.settings$);

  defaultWeightUnit: WeightUnit = WeightUnit.KG;
  defaultWeightUnit$ = this.settings$.pipe(map((s) => s.defaultWeightUnit));

  constructor(@Inject(DATA_SOURCE_INJECTION_TOKEN) private data: DataSource) {
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
