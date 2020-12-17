import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { RxdbService } from 'src/app/services/rxdb.service';

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.scss'],
})
export class WorkoutLogPageComponent {
  workouts$ = this.rxdb.workouts$.pipe(
    map((ws) => ws.map((w) => w.exercises.map((e) => e.templateId).toString()))
  );

  constructor(private rxdb: RxdbService) {}
}
