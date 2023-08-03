import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDrugsDeactivateComponent } from './financial-drugs-deactivate.component';

describe('FinancialDrugsDeactivateComponent', () => {
  let component: FinancialDrugsDeactivateComponent;
  let fixture: ComponentFixture<FinancialDrugsDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialDrugsDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialDrugsDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
