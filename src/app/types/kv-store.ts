import localforage from 'localforage';
import { BehaviorSubject, Observable } from 'rxjs';

export class KVStore<T> {
  private readonly instance: LocalForage;

  constructor(private readonly name: string) {
    this.instance = localforage.createInstance({
      name: this.name,
    });
  }

  async upsert(id: string, item: T): Promise<void> {
    await this.instance.setItem(id, item);
  }

  async upsertAll(items: [key: string, value: T][]): Promise<void> {
    await Promise.all(items.map(([k, v]) => this.instance.setItem(k, v)));
  }

  async get(id: string): Promise<T> {
    return (await this.instance.getItem(id)) as T;
  }

  async remove(id: string): Promise<void> {
    await this.instance.removeItem(id);
  }

  async clear(): Promise<void> {
    await this.instance.clear();
  }

  async items(): Promise<T[]> {
    const items: T[] = [];
    await this.instance.iterate((item: T) => {
      items.push(item);
    });
    return items;
  }
}

export class CachedKVStore<T> extends KVStore<T> {
  private readonly _cache$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  cache$: Observable<T[]> = this._cache$;

  readonly waitForInit: Promise<void> = new Promise((resolve) =>
    this.init().then(() => resolve())
  );

  async init(): Promise<void> {
    await this._reload();
  }

  async upsert(id: string, item: T): Promise<void> {
    await super.upsert(id, item);
    await this._reload();
  }

  async upsertAll(items: [key: string, value: T][]): Promise<void> {
    await super.upsertAll(items);
    await this._reload();
  }

  async remove(id: string): Promise<void> {
    await super.remove(id);
    await this._reload();
  }

  async clear(): Promise<void> {
    await super.clear();
    await this._reload();
  }

  private async _reload(): Promise<void> {
    this._cache$.next(await this.items());
  }
}
