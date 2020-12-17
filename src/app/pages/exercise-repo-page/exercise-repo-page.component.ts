import { Component } from '@angular/core';
import { RxdbService } from 'src/app/services/rxdb.service';

@Component({
  selector: 'app-exercise-repo-page',
  templateUrl: './exercise-repo-page.component.html',
  styleUrls: ['./exercise-repo-page.component.scss'],
})
export class ExerciseRepoPageComponent {
  exercises$ = this.rxdb.exercises$;

  constructor(private rxdb: RxdbService) {}
}
