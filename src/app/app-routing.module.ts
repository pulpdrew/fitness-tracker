import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWorkoutPageComponent } from './pages/edit-workout-page/edit-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';
import {
  DASHBOARD_ROUTE,
  EXERCISE_TYPES_ROUTE,
  SETTINGS_ROUTE,
  WORKOUT_LOG_ROUTE,
  WORKOUT_ROUTE,
} from './constants';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  { path: `${WORKOUT_ROUTE}/:id`, component: EditWorkoutPageComponent },
  { path: WORKOUT_LOG_ROUTE, component: WorkoutLogPageComponent },
  { path: EXERCISE_TYPES_ROUTE, component: ExerciseRepoPageComponent },
  { path: DASHBOARD_ROUTE, component: DashboardPageComponent },
  { path: SETTINGS_ROUTE, component: SettingsPageComponent },
  { path: '', redirectTo: DASHBOARD_ROUTE, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
