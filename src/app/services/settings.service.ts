import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import DataStore, { DATA_STORE } from '../types/data-store';
import {
  ApplicationSettings,
  DEFAULT_WEIGHT_UNIT,
  HAS_SEEN_WELCOME_SCREEN,
} from '../types/settings';
import { WeightUnit } from '../types/weight';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settings$ = new BehaviorSubject<ApplicationSettings>(
    ApplicationSettings.default()
  );
  readonly settings$: Observable<ApplicationSettings> = this._settings$;

  /**
   * An observable copy of the default weight unit
   */
  defaultWeightUnit$ = this.settings$.pipe(map((s) => s[DEFAULT_WEIGHT_UNIT]));

  /**
   * Indicates whether the user has been shown the welcome screen
   */
  hasSeenWelcomeScreen$ = this.settings$.pipe(
    filter(
      (s) =>
        s[HAS_SEEN_WELCOME_SCREEN] != undefined &&
        s[HAS_SEEN_WELCOME_SCREEN] != null
    ),
    map((s) => !!s[HAS_SEEN_WELCOME_SCREEN])
  );

  constructor(@Inject(DATA_STORE) private data: DataStore) {
    this.data.settings$.subscribe((settings) => {
      this._settings$.next(settings);
    });
  }

  /**
   * Set and save a new default weight unit.
   *
   * @param unit the new default weight unit
   */
  async setDefaultWeightUnit(unit: WeightUnit): Promise<void> {
    const currentSettings = await this.settings$.pipe(take(1)).toPromise();
    await this.data.updateSettings(
      new ApplicationSettings({
        ...currentSettings.data,
        [DEFAULT_WEIGHT_UNIT]: unit,
      })
    );
  }

  /**
   * Set whether the user has been shown the welcome screen.
   *
   * @param hasSeenWelcomeScreen whether the user has been shown the
   *  welcome screen, defaults to true
   */
  async setHasSeenWelcomeScreen(hasSeenWelcomeScreen = true): Promise<void> {
    const currentSettings = await this.settings$.pipe(take(1)).toPromise();
    await this.data.updateSettings(
      new ApplicationSettings({
        ...currentSettings.data,
        [HAS_SEEN_WELCOME_SCREEN]: hasSeenWelcomeScreen,
      })
    );
  }
}
