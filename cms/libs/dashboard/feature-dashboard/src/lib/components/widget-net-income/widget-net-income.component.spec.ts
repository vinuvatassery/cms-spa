import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetNetIncomeComponent } from './widget-net-income.component';

describe('WidgetNetIncomeComponent', () => {
  let component: WidgetNetIncomeComponent;
  let fixture: ComponentFixture<WidgetNetIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetNetIncomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetNetIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
