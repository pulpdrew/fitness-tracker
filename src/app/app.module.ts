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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { EditWorkoutPageComponent } from './pages/edit-workout-page/edit-workout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { WorkoutLogPageComponent } from './pages/workout-log-page/workout-log.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';
import { ExerciseRepoPageComponent } from './pages/exercise-repo-page/exercise-repo-page.component';
import { EditExerciseTypeDialogComponent } from './components/edit-exercise-type-dialog/edit-exercise-type-dialog.component';
import { AddExerciseDialogComponent } from './components/add-exercise-dialog/add-exercise-dialog.component';
import { ImportExportPageComponent } from './pages/import-export-page/import-export-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {
  DisplayFieldsPipe,
  DisplayFieldPipe,
} from './pipes/display-fields.pipe';
import {
  DisplayCategoriesPipe,
  DisplayCategoryPipe,
} from './pipes/display-categories.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { ExerciseChartComponent } from './components/exercise-chart/exercise-chart.component';
import { SetPipe } from './pipes/set.pipe';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { RxdbService } from './services/rxdb.service';
import { DATA_SOURCE_INJECTION_TOKEN } from './constants';
import { ExerciseDetailsComponent } from './components/exercise-details/exercise-details.component';
import { ExerciseTypeListItemComponent } from './components/exercise-type-list-item/exercise-type-list-item.component';
import { ExerciseHistoryItemComponent } from './components/exercise-history-item/exercise-history-item.component';
import { ChartToggleLegendComponent } from './components/chart-toggle-legend/chart-toggle-legend.component';

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
    ImportExportPageComponent,
    ExerciseChartComponent,
    SetPipe,
    SettingsPageComponent,
    ExerciseDetailsComponent,
    ExerciseTypeListItemComponent,
    ExerciseHistoryItemComponent,
    ChartToggleLegendComponent,
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
  ],
  providers: [
    DisplayCategoryPipe,
    { provide: DATA_SOURCE_INJECTION_TOKEN, useClass: RxdbService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
