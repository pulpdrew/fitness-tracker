import { Component } from '@angular/core';
import { RxdbService } from './services/rxdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fitness-tracker';

  constructor(private rxdb: RxdbService) {}
}
