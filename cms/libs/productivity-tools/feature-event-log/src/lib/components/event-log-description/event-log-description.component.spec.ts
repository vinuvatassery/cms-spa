import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventLogDescriptionComponent } from './event-log-description.component';

describe('EventLogDescriptionComponent', () => {
  let component: EventLogDescriptionComponent;
  let fixture: ComponentFixture<EventLogDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventLogDescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventLogDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
