import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPharmacyPriorityComponent } from './set-pharmacy-priority.component';

describe('SetPharmacyPriorityComponent', () => {
  let component: SetPharmacyPriorityComponent;
  let fixture: ComponentFixture<SetPharmacyPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetPharmacyPriorityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPharmacyPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
