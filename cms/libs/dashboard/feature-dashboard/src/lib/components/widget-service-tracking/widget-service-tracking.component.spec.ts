import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetServiceTrackingComponent } from './widget-service-tracking.component';

describe('WidgetServiceTrackingComponent', () => {
  let component: WidgetServiceTrackingComponent;
  let fixture: ComponentFixture<WidgetServiceTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetServiceTrackingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetServiceTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
