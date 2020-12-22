import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWorkoutPageComponent } from './pages/edit-workout-page/edit-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';
import { ImportExportPageComponent } from './pages/import-export-page/import-export-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';
import {
  DASHBOARD_ROUTE,
  DATA_MANAGEMENT_ROUTE,
  EXERCISE_TYPES_ROUTE,
  WORKOUT_LOG_ROUTE,
  WORKOUT_ROUTE,
} from './constants';

const routes: Routes = [
  { path: `${WORKOUT_ROUTE}/:id`, component: EditWorkoutPageComponent },
  { path: WORKOUT_LOG_ROUTE, component: WorkoutLogPageComponent },
  { path: EXERCISE_TYPES_ROUTE, component: ExerciseRepoPageComponent },
  { path: DATA_MANAGEMENT_ROUTE, component: ImportExportPageComponent },
  { path: DASHBOARD_ROUTE, component: DashboardPageComponent },
  { path: '', redirectTo: DASHBOARD_ROUTE, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
