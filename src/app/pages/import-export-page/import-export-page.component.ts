import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RxdbService } from 'src/app/services/rxdb.service';

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

  constructor(private rxdb: RxdbService, private sanitizer: DomSanitizer) {
    this.reader.onload = () => {
      this.rxdb.import(this.reader.result?.toString() || '');
    };
  }

  async ngOnInit(): Promise<void> {
    const data = await this.rxdb.export();
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
