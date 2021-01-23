import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SettingsService } from 'src/app/services/settings.service';
import DataStore, { DATA_STORE } from 'src/app/types/data-store';
import { Dump } from 'src/app/types/dump';
import { WeightUnit, ALL_WEIGHT_UNITS } from 'src/app/types/weight';

interface FileInputTarget extends EventTarget {
  files?: File[];
}

type FileInputChangeEvent = {
  target?: FileInputTarget | null;
};

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  defaultWeightUnitControl = new FormControl(null);

  readonly WEIGHT_UNITS = ALL_WEIGHT_UNITS;

  /**
   * A file reader used to read an import file
   */
  reader = new FileReader();

  /**
   * A reference to the import file, once the user chooses
   * one with the file chooser.
   */
  file: File | null = null;

  /**
   * The Object URL at which a data store export can be accessed
   */
  downloadUrl: SafeUrl | null = null;

  constructor(
    private settings: SettingsService,
    @Inject(DATA_STORE) private data: DataStore,
    private sanitizer: DomSanitizer
  ) {
    // When a file is loaded, import it into the data store
    this.reader.onload = () => {
      const dumpString = this.reader.result?.toString() || '';
      try {
        const dump = JSON.parse(dumpString) as Dump;
        this.data.importData(dump);
      } catch (err) {
        console.error('Cannot parse import: ' + err);
      }
    };
  }

  async ngOnInit(): Promise<void> {
    this.settings.defaultWeightUnit$.subscribe((unit) => {
      if (unit && this.defaultWeightUnitControl.value != unit) {
        this.defaultWeightUnitControl.setValue(unit);
      }
    });

    this.defaultWeightUnitControl.valueChanges.subscribe((unit: WeightUnit) =>
      this.settings.setDefaultWeightUnit(unit)
    );

    // Create an object URL that can be used to download the datastore dump
    const data = await this.data.exportData();
    const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
    this.downloadUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob)
    );
  }

  /**
   * Callback for changes of the import file
   */
  onImportFileChange(event: FileInputChangeEvent): void {
    if (event?.target?.files) {
      this.file = event?.target?.files[0] || null;
    }
  }

  /**
   * Callback for the import button
   */
  onClickImport(): void {
    if (this.file) {
      this.reader.readAsText(this.file?.slice() || new Blob());
    }
  }
}
