import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectDeleteComponent } from './financial-pcas-object-delete.component';

describe('FinancialPcasObjectDeleteComponent', () => {
  let component: FinancialPcasObjectDeleteComponent;
  let fixture: ComponentFixture<FinancialPcasObjectDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasObjectDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
