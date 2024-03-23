import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDirectMessagesComponent } from './widget-direct-messages.component';

describe('WidgetDirectMessagesComponent', () => {
  let component: WidgetDirectMessagesComponent;
  let fixture: ComponentFixture<WidgetDirectMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetDirectMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDirectMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
