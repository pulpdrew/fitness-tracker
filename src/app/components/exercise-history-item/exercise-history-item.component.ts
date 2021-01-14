import { Component, Input } from '@angular/core';
import { HistoryEntry } from 'src/app/services/history.service';

@Component({
  selector: 'app-exercise-history-item',
  templateUrl: './exercise-history-item.component.html',
  styleUrls: ['./exercise-history-item.component.scss'],
})
export class ExerciseHistoryItemComponent {
  @Input() entry: HistoryEntry | null = null;
}
