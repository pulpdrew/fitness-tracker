import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import * as adapter from 'pouchdb-adapter-indexeddb';

@Injectable({
  providedIn: 'root',
})
export class RxdbService {
  db: RxDatabase | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    addRxPlugin(adapter);
    addRxPlugin(RxDBValidatePlugin);

    this.db = await createRxDatabase({
      name: 'workout',
      adapter: 'indexeddb',
    });

    await this.db.addCollections({
      stuff: {
        schema: {
          properties: {
            name: {
              type: 'string',
              primary: true,
            },
          },
          type: 'object',
          version: 0,
        },
      },
    });

    await this.db.stuff.upsert({
      name: 'Andrew',
    });

    console.log((await this.db.stuff.find().exec()).map((d) => d.name));
  }
}
