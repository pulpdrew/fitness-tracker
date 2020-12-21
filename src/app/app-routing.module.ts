import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddWorkoutPageComponent } from './pages/add-workout-page/add-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';
import { ImportExportPageComponent } from './pages/import-export-page/import-export-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';
import { v4 as uuidv4 } from 'uuid';

export const WORKOUT_LOG_ROUTE = 'workout-log';
export const DASHBOARD_ROUTE = 'dashboard';
export const EXERCISE_TYPES_ROUTE = 'exercises';
export const DATA_MANAGEMENT_ROUTE = 'import-export';
export const WORKOUT_ROUTE = 'workout';

export function routeToWorkout(id: string = uuidv4()): string {
  return `${WORKOUT_ROUTE}/${id}`;
}

const routes: Routes = [
  { path: `${WORKOUT_ROUTE}/:id`, component: AddWorkoutPageComponent },
  { path: WORKOUT_ROUTE, redirectTo: `${WORKOUT_ROUTE}/${uuidv4()}` },
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
