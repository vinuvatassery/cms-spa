import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasGroupRemoveComponent } from './financial-pcas-group-remove.component';

describe('FinancialPcasGroupRemoveComponent', () => {
  let component: FinancialPcasGroupRemoveComponent;
  let fixture: ComponentFixture<FinancialPcasGroupRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasGroupRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasGroupRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
