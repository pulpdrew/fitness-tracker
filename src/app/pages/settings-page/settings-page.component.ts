import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { WeightUnit, weightUnits } from 'src/app/types/workout';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  defaultWeightUnitControl = new FormControl(null);
  weightUnits = weightUnits;

  constructor(private settings: SettingsService) {}

  ngOnInit(): void {
    this.settings.defaultWeightUnit$.subscribe((unit) => {
      if (unit && this.defaultWeightUnitControl.value != unit) {
        this.defaultWeightUnitControl.setValue(unit);
      }
    });

    this.defaultWeightUnitControl.valueChanges.subscribe((unit: WeightUnit) =>
      this.settings.setDefaultWeightUnit(unit)
    );
  }
}
