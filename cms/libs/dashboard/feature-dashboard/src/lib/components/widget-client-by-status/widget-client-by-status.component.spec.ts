import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetClientByStatusComponent } from './widget-client-by-status.component';

describe('WidgetClientByStatusComponent', () => {
  let component: WidgetClientByStatusComponent;
  let fixture: ComponentFixture<WidgetClientByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetClientByStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetClientByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
