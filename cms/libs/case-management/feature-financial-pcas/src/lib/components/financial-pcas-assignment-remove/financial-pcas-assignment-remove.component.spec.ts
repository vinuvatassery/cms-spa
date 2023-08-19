import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasAssignmentRemoveComponent } from './financial-pcas-assignment-remove.component';

describe('FinancialPcasAssignmentRemoveComponent', () => {
  let component: FinancialPcasAssignmentRemoveComponent;
  let fixture: ComponentFixture<FinancialPcasAssignmentRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasAssignmentRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasAssignmentRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
