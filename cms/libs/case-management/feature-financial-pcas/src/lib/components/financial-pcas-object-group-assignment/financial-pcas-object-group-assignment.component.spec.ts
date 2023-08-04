import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectGroupAssignmentComponent } from './financial-pcas-object-group-assignment.component';

describe('FinancialPcasObjectGroupAssignmentComponent', () => {
  let component: FinancialPcasObjectGroupAssignmentComponent;
  let fixture: ComponentFixture<FinancialPcasObjectGroupAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectGroupAssignmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPcasObjectGroupAssignmentComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
