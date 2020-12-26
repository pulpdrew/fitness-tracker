import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseChartComponent } from './exercise-chart.component';

describe('ExerciseChartComponent', () => {
  let component: ExerciseChartComponent;
  let fixture: ComponentFixture<ExerciseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciseChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
