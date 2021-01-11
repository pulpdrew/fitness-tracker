import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { EditWorkoutPageComponent } from './pages/edit-workout-page/edit-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';
import { EditExerciseTypeDialogComponent } from './components/edit-exercise-type-dialog/edit-exercise-type-dialog.component';
import { AddExerciseDialogComponent } from './components/add-exercise-dialog/add-exercise-dialog.component';
import { ExerciseDetailsComponent } from './components/exercise-details/exercise-details.component';
import { ExerciseHistoryItemComponent } from './components/exercise-history-item/exercise-history-item.component';
import { ChartToggleLegendComponent } from './components/chart-toggle-legend/chart-toggle-legend.component';
import { SetFormComponent } from './components/set-form/set-form.component';
import { ExerciseChartComponent } from './components/exercise-chart/exercise-chart.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import {
  DisplayFieldsPipe,
  DisplayFieldPipe,
} from './pipes/display-fields.pipe';
import {
  DisplayCategoriesPipe,
  DisplayCategoryPipe,
} from './pipes/display-categories.pipe';
import { SetPipe } from './pipes/set.pipe';
import { RxdbService } from './services/rxdb.service';
import { DATA_SOURCE_INJECTION_TOKEN } from './constants';

@NgModule({
  declarations: [
    AppComponent,
    EditWorkoutPageComponent,
    DashboardPageComponent,
    WorkoutLogPageComponent,
    DashboardCardComponent,
    ExerciseFormComponent,
    ExerciseRepoPageComponent,
    EditExerciseTypeDialogComponent,
    AddExerciseDialogComponent,
    DisplayFieldsPipe,
    DisplayFieldPipe,
    DisplayCategoriesPipe,
    DisplayCategoryPipe,
    ExerciseChartComponent,
    SetPipe,
    SettingsPageComponent,
    ExerciseDetailsComponent,
    ExerciseHistoryItemComponent,
    ChartToggleLegendComponent,
    SetFormComponent,
    NavbarComponent,
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
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    NgxChartsModule,
    MatSnackBarModule,
    MatExpansionModule,
  ],
  providers: [
    DisplayCategoryPipe,
    { provide: DATA_SOURCE_INJECTION_TOKEN, useClass: RxdbService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
