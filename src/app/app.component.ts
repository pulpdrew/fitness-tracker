import { Component } from '@angular/core';
import { DASHBOARD_ROUTE } from './app-routing.module';
import { RxdbService } from './services/rxdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dashboardRoute = DASHBOARD_ROUTE;

  constructor(private rxdb: RxdbService) {}
}
