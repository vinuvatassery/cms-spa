import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectListComponent } from './financial-pcas-object-list.component';

describe('FinancialPcasObjectListComponent', () => {
  let component: FinancialPcasObjectListComponent;
  let fixture: ComponentFixture<FinancialPcasObjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasObjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
