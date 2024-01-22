import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetInsuranceTypeFplComponent } from './widget-insurance-type-fpl.component';

describe('WidgetInsuranceTypeFplComponent', () => {
  let component: WidgetInsuranceTypeFplComponent;
  let fixture: ComponentFixture<WidgetInsuranceTypeFplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetInsuranceTypeFplComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetInsuranceTypeFplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
