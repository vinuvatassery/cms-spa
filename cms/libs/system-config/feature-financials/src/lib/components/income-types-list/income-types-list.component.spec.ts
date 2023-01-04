import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTypesListComponent } from './income-types-list.component';

describe('IncomeTypesListComponent', () => {
  let component: IncomeTypesListComponent;
  let fixture: ComponentFixture<IncomeTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeTypesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
