import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendIdCardComponent } from './send-id-card.component';

describe('SendIdCardComponent', () => {
  let component: SendIdCardComponent;
  let fixture: ComponentFixture<SendIdCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendIdCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
