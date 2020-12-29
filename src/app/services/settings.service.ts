import { Injectable } from '@angular/core';
import { concat, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { getDefaultSettings } from '../types/settings';
import { WeightUnit } from '../types/workout';
import { RxdbService } from './rxdb.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings$ = concat(of(getDefaultSettings()), this.rxdb.settings$);

  defaultWeightUnit: WeightUnit = WeightUnit.KG;
  defaultWeightUnit$ = this.settings$.pipe(map((s) => s.defaultWeightUnit));

  constructor(private rxdb: RxdbService) {
    this.defaultWeightUnit$.subscribe(
      (unit) => (this.defaultWeightUnit = unit)
    );
  }

  async setDefaultWeightUnit(unit: WeightUnit): Promise<void> {
    const currentSettings = await this.settings$.pipe(take(1)).toPromise();
    await this.rxdb.saveSettings({
      ...currentSettings,
      defaultWeightUnit: unit,
    });
  }
}
