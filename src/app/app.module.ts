import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

import { AddWorkoutPageComponent } from './pages/add-workout-page/add-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';
import { ExerciseTemplateDialogComponent } from './components/exercise-template-dialog/exercise-template-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AddWorkoutPageComponent,
    DashboardPageComponent,
    WorkoutLogPageComponent,
    DashboardCardComponent,
    ExerciseFormComponent,
    ExerciseRepoPageComponent,
    ExerciseTemplateDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
