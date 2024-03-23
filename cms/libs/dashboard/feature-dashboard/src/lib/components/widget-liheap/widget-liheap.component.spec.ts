import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetLiheapComponent } from './widget-liheap.component';

describe('WidgetLiheapComponent', () => {
  let component: WidgetLiheapComponent;
  let fixture: ComponentFixture<WidgetLiheapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetLiheapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetLiheapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
