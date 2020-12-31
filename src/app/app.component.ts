import { Component } from '@angular/core';
import { DASHBOARD_ROUTE } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dashboardRoute = DASHBOARD_ROUTE;
}
