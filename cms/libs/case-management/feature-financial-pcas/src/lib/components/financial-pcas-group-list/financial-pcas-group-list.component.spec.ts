import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasGroupListComponent } from './financial-pcas-group-list.component';

describe('FinancialPcasGroupListComponent', () => {
  let component: FinancialPcasGroupListComponent;
  let fixture: ComponentFixture<FinancialPcasGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasGroupListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
