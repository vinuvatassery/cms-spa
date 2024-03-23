import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetProgramIncomeComponent } from './widget-program-income.component';

describe('WidgetProgramIncomeComponent', () => {
  let component: WidgetProgramIncomeComponent;
  let fixture: ComponentFixture<WidgetProgramIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetProgramIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetProgramIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
