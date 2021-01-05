import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

const SERIES_KEY = 'series';

@Component({
  selector: 'app-chart-toggle-legend',
  templateUrl: './chart-toggle-legend.component.html',
  styleUrls: ['./chart-toggle-legend.component.scss'],
})
export class ChartToggleLegendComponent implements OnInit, OnChanges {
  @Input() series: string[] = [];
  @Input() colors: string[] = [];
  @Output() change = new EventEmitter<string[]>();

  form = new FormGroup({
    [SERIES_KEY]: new FormArray([]),
  });

  get checkboxStates(): FormArray {
    return this.form.get(SERIES_KEY) as FormArray;
  }

  get currentlySelected(): string[] {
    return this.filterSelected(this.series);
  }

  get colorNames(): string[] {
    return this.colors.map((color) => `color-${color.substr(1)}`);
  }

  ngOnInit(): void {
    this.updateForm(this.series);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']) {
      this.updateForm(
        changes['series'].currentValue,
        changes['series'].previousValue
      );
    }
  }

  onCheckboxChange(): void {
    this.change.emit(this.currentlySelected);
  }

  private updateForm(current: string[], previous: string[] = []): void {
    const previouslySelected = this.filterSelected(previous);
    const currentlySelected = current.filter(
      (series) =>
        previouslySelected.includes(series) || !previous.includes(series)
    );

    this.form = new FormGroup({
      [SERIES_KEY]: new FormArray(
        current.map(
          (series) => new FormControl(currentlySelected.includes(series))
        )
      ),
    });
  }

  /**
   * Returns the strings in `series` that are selected based on the current form value.
   */
  private filterSelected(series: string[]): string[] {
    return this.checkboxStates.controls
      .map((c) => c.value as boolean)
      .map((state, i) => (state ? series[i] : null))
      .filter((series) => !!series)
      .map((series) => series!);
  }
}
