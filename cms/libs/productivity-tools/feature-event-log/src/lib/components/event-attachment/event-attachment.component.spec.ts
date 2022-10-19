import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAttachmentComponent } from './event-attachment.component';

describe('EventAttachmentComponent', () => {
  let component: EventAttachmentComponent;
  let fixture: ComponentFixture<EventAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventAttachmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
