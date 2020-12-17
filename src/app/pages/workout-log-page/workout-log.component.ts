import { Component, OnInit } from '@angular/core';
import { RxdbService } from 'src/app/services/rxdb.service';

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.scss'],
})
export class WorkoutLogPageComponent implements OnInit {
  constructor(private rxdb: RxdbService) {}

  ngOnInit(): void {
    this.rxdb.printWorkouts();
  }
}
