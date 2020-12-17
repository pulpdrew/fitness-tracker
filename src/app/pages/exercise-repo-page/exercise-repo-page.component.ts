import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseTemplateDialogComponent } from 'src/app/components/exercise-template-dialog/exercise-template-dialog.component';
import { RxdbService } from 'src/app/services/rxdb.service';
import {
  emptyTemplate,
  ExerciseTemplate,
} from 'src/app/types/exercise-template';

@Component({
  selector: 'app-exercise-repo-page',
  templateUrl: './exercise-repo-page.component.html',
  styleUrls: ['./exercise-repo-page.component.scss'],
})
export class ExerciseRepoPageComponent {
  exercises$ = this.rxdb.exercises$;

  constructor(private rxdb: RxdbService, private dialog: MatDialog) {}

  edit(template: ExerciseTemplate = emptyTemplate()): void {
    const ref = this.dialog.open(ExerciseTemplateDialogComponent, {
      minWidth: '40ex',
      minHeight: '20em',
      data: template,
    });

    ref.afterClosed().subscribe((editedTemplate) => {
      if (editedTemplate) this.rxdb.saveExerciseTemplate(editedTemplate);
    });
  }

  remove(template: ExerciseTemplate): void {
    this.rxdb.deleteExerciseTemplate(template);
  }
}
