import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DATA_SOURCE_INJECTION_TOKEN } from 'src/app/constants';
import DataSource from 'src/app/types/data-source';

interface FileInputTarget extends EventTarget {
  files?: File[];
}

type FileInputChangeEvent = {
  target?: FileInputTarget | null;
};

@Component({
  selector: 'app-import-export-page',
  templateUrl: './import-export-page.component.html',
  styleUrls: ['./import-export-page.component.scss'],
})
export class ImportExportPageComponent implements OnInit {
  file: File | null = null;
  downloadUrl: SafeUrl | null = null;
  reader = new FileReader();

  constructor(
    @Inject(DATA_SOURCE_INJECTION_TOKEN) private data: DataSource,
    private sanitizer: DomSanitizer
  ) {
    this.reader.onload = () => {
      this.data.importData(this.reader.result?.toString() || '');
    };
  }

  async ngOnInit(): Promise<void> {
    const data = await this.data.exportData();
    const blob = new Blob([data], { type: 'text/json' });
    this.downloadUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob)
    );
  }

  onFileChange(event: FileInputChangeEvent): void {
    if (event?.target?.files) {
      this.file = event?.target?.files[0] || null;
    }
  }

  import(): void {
    if (this.file) {
      this.reader.readAsText(this.file?.slice() || new Blob());
    }
  }
}
