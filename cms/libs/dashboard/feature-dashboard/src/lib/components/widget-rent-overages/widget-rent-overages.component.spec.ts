import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetRentOveragesComponent } from './widget-rent-overages.component';

describe('WidgetRentOveragesComponent', () => {
  let component: WidgetRentOveragesComponent;
  let fixture: ComponentFixture<WidgetRentOveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetRentOveragesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetRentOveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
