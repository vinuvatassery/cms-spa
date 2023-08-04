import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasGroupFormComponent } from './financial-pcas-group-form.component';

describe('FinancialPcasGroupFormComponent', () => {
  let component: FinancialPcasGroupFormComponent;
  let fixture: ComponentFixture<FinancialPcasGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasGroupFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
