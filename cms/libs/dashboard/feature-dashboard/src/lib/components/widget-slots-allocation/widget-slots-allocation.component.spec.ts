import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetSlotsAllocationComponent } from './widget-slots-allocation.component';

describe('WidgetSlotsAllocationComponent', () => {
  let component: WidgetSlotsAllocationComponent;
  let fixture: ComponentFixture<WidgetSlotsAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetSlotsAllocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetSlotsAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
