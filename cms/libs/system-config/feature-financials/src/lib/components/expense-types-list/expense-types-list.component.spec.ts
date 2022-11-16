import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypesListComponent } from './expense-types-list.component';

describe('ExpenseTypesListComponent', () => {
  let component: ExpenseTypesListComponent;
  let fixture: ComponentFixture<ExpenseTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseTypesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
