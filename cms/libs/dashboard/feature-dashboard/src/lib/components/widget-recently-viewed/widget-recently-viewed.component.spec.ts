import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRecentlyViewedComponent } from './widget-recently-viewed.component';

describe('WidgetRecentlyViewedComponent', () => {
  let component: WidgetRecentlyViewedComponent;
  let fixture: ComponentFixture<WidgetRecentlyViewedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetRecentlyViewedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRecentlyViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
