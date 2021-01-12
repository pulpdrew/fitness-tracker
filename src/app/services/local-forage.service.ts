import { BehaviorSubject, Observable } from 'rxjs';
import DataSource from '../types/data-source';
import { ExerciseType } from '../types/exercise-type';
import { getDefaultSettings, Settings } from '../types/settings';
import { Workout } from '../types/workout';
import localforage from 'localforage';
import { filter, map, take } from 'rxjs/operators';

export default class LocalForageService implements DataSource {
  private readonly _isInitialized$ = new BehaviorSubject<boolean>(false);
  private readonly _exerciseTypes$ = new BehaviorSubject<ExerciseType[]>([]);
  private readonly _workouts$ = new BehaviorSubject<Workout[]>([]);
  private readonly _settings$ = new BehaviorSubject<Settings>(
    getDefaultSettings()
  );

  readonly exerciseTypes$: Observable<
    ExerciseType[]
  > = this._exerciseTypes$
    .asObservable()
    .pipe(map((types) => types.sort((a, b) => a.name.localeCompare(b.name))));

  readonly workouts$: Observable<Workout[]> = this._workouts$.asObservable();
  readonly settings$: Observable<Settings> = this._settings$.asObservable();

  private exerciseTypeInstance: LocalForage = localforage.createInstance({
    name: 'exercise-types',
  });

  constructor() {
    this.init().then(() => {
      this._isInitialized$.next(true);
    });
  }

  private async init() {
    await this.loadExerciseTypes();
  }

  upsertWorkout(workout: Workout): Promise<void> {
    throw new Error('Method not implemented.');
  }

  deleteWorkout(workout: Workout): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async upsertExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit();
      await this.exerciseTypeInstance.setItem(type.id, type);
      await this.loadExerciseTypes();
    } catch (err) {
      console.error('Error upserting exercise type: ' + err);
    }
  }

  async deleteExerciseType(type: ExerciseType): Promise<void> {
    try {
      await this.waitForInit();
      await this.exerciseTypeInstance.removeItem(type.id);
      await this.loadExerciseTypes();
    } catch (err) {
      console.error('Error deleting exercise type: ' + err);
    }
  }

  exportData(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  importData(json: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updateSettings(settings: Settings): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async clear(): Promise<void> {
    await this.waitForInit();
    await this.exerciseTypeInstance.clear();
    await this.loadExerciseTypes();
  }

  async waitForInit(): Promise<void> {
    await this._isInitialized$
      .asObservable()
      .pipe(
        filter((init) => !!init),
        take(1)
      )
      .toPromise();
  }

  private async loadExerciseTypes(): Promise<void> {
    const updatedTypes: ExerciseType[] = [];
    await this.exerciseTypeInstance.iterate((type: ExerciseType) => {
      updatedTypes.push(type);
    });
    this._exerciseTypes$.next(updatedTypes);
  }
}
