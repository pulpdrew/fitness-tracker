import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseRepoPageComponent } from './exercise-repo-page.component';

describe('ExerciseRepoPageComponent', () => {
  let component: ExerciseRepoPageComponent;
  let fixture: ComponentFixture<ExerciseRepoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciseRepoPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseRepoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
