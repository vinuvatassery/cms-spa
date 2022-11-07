import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetHealthInsurancePriorityComponent } from './set-health-insurance-priority.component';

describe('SetHealthInsurancePriorityComponent', () => {
  let component: SetHealthInsurancePriorityComponent;
  let fixture: ComponentFixture<SetHealthInsurancePriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetHealthInsurancePriorityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetHealthInsurancePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
