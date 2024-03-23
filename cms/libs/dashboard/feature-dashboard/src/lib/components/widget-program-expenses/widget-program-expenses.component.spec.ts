import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetProgramExpensesComponent } from './widget-program-expenses.component';

describe('WidgetProgramExpensesComponent', () => {
  let component: WidgetProgramExpensesComponent;
  let fixture: ComponentFixture<WidgetProgramExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetProgramExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetProgramExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
