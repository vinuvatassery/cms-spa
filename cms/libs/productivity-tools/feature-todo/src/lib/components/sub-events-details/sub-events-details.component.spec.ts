import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubEventsDetailsComponent } from './sub-events-details.component';

describe('SubEventsDetailsComponent', () => {
  let component: SubEventsDetailsComponent;
  let fixture: ComponentFixture<SubEventsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubEventsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubEventsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
