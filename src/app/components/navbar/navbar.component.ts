import { Component } from '@angular/core';
import { DASHBOARD_ROUTE, SETTINGS_ROUTE } from 'src/app/constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly DASHBOARD_ROUTE = DASHBOARD_ROUTE;
  readonly SETTINGS_ROUTE = SETTINGS_ROUTE;
}
