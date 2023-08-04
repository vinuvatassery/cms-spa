import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectRemoveComponent } from './financial-pcas-object-remove.component';

describe('FinancialPcasObjectRemoveComponent', () => {
  let component: FinancialPcasObjectRemoveComponent;
  let fixture: ComponentFixture<FinancialPcasObjectRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasObjectRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
