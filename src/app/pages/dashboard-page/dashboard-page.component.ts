import { Component } from '@angular/core';
import { DATA_MANAGEMENT_ROUTE, EXERCISE_TYPES_ROUTE, routeToWorkout, WORKOUT_LOG_ROUTE } from 'src/app/app-routing.module';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  workoutRoute = "/" + routeToWorkout();
  workoutLogRoute = "/" + WORKOUT_LOG_ROUTE;
  exercisesRoute = "/" + EXERCISE_TYPES_ROUTE;
  dataRoute = "/" + DATA_MANAGEMENT_ROUTE;
}
