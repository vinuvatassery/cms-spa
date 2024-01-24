import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetActiveClientsByGroupComponent } from './widget-active-clients-by-group.component';

describe('WidgetActiveClientsByGroupComponent', () => {
  let component: WidgetActiveClientsByGroupComponent;
  let fixture: ComponentFixture<WidgetActiveClientsByGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetActiveClientsByGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetActiveClientsByGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
