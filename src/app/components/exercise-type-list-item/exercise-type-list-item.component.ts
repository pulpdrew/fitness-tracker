import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-exercise-type-list-item',
  templateUrl: './exercise-type-list-item.component.html',
  styleUrls: ['./exercise-type-list-item.component.scss'],
})
export class ExerciseTypeListItemComponent {
  @Input() name = '';

  @Output() view = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  hover = false;

  mouseEnter(): void {
    this.hover = true;
  }

  mouseLeave(): void {
    this.hover = false;
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit();
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }

  onView(event: MouseEvent): void {
    event.stopPropagation();
    this.view.emit();
  }
}
