import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddWorkoutPageComponent } from './pages/add-workout-page/add-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';
import { ImportExportPageComponent } from './pages/import-export-page/import-export-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';

const routes: Routes = [
  { path: 'add-workout', component: AddWorkoutPageComponent },
  { path: 'workout-log', component: WorkoutLogPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'exercises', component: ExerciseRepoPageComponent },
  { path: 'import-export', component: ImportExportPageComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
