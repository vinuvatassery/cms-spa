import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetTodayAtAGlanceComponent } from './widget-today-at-a-glance.component';

describe('WidgetTodayAtAGlanceComponent', () => {
  let component: WidgetTodayAtAGlanceComponent;
  let fixture: ComponentFixture<WidgetTodayAtAGlanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetTodayAtAGlanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetTodayAtAGlanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
