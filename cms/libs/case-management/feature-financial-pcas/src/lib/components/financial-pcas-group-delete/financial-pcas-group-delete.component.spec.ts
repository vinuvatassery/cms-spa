import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasGroupDeleteComponent } from './financial-pcas-group-delete.component';

describe('FinancialPcasGroupDeleteComponent', () => {
  let component: FinancialPcasGroupDeleteComponent;
  let fixture: ComponentFixture<FinancialPcasGroupDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasGroupDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasGroupDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
