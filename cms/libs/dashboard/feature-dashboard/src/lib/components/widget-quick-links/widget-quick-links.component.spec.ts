import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetQuickLinksComponent } from './widget-quick-links.component';

describe('WidgetQuickLinksComponent', () => {
  let component: WidgetQuickLinksComponent;
  let fixture: ComponentFixture<WidgetQuickLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetQuickLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetQuickLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
