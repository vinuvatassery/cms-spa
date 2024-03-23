import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetApplicationsCersComponent } from './widget-applications-cers.component';

describe('WidgetApplicationsCersComponent', () => {
  let component: WidgetApplicationsCersComponent;
  let fixture: ComponentFixture<WidgetApplicationsCersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetApplicationsCersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetApplicationsCersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
