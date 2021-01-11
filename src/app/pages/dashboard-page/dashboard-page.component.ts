import { Component } from '@angular/core';
import {
  EXERCISE_TYPES_ROUTE,
  WORKOUT_LOG_ROUTE,
  WORKOUT_ROUTE,
} from 'src/app/constants';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  workoutRoute = `/${WORKOUT_ROUTE}/${uuidv4()}`;
  workoutLogRoute = '/' + WORKOUT_LOG_ROUTE;
  exercisesRoute = '/' + EXERCISE_TYPES_ROUTE;
}
