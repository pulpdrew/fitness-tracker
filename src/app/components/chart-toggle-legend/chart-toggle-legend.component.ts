import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  @Input() selected: string[] = [];
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
    this.updateForm();
  }

  ngOnChanges(): void {
    this.updateForm();
  }

  /**
   * Fired when a checkbox is checked or unchecked.
   * Updates `this.selected` and emits a change event.
   */
  onCheckboxChange(): void {
    this.selected = this.currentlySelected;
    this.change.emit(this.currentlySelected);
  }

  /**
   * Use `this.series` and `this.selected` to update the form state.
   */
  private updateForm(): void {
    this.form = new FormGroup({
      [SERIES_KEY]: new FormArray(
        this.series.map(
          (series) => new FormControl(this.selected.includes(series))
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
