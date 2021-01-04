import { Component, Input } from '@angular/core';
import { WorkoutSummary } from 'src/app/services/exercise-stats.service';

@Component({
  selector: 'app-exercise-history-item',
  templateUrl: './exercise-history-item.component.html',
  styleUrls: ['./exercise-history-item.component.scss'],
})
export class ExerciseHistoryItemComponent {
  @Input() workout: WorkoutSummary | null = null;
}
