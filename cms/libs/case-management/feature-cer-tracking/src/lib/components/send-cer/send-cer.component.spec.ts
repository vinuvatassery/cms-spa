import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCerComponent } from './send-cer.component';

describe('SendCerComponent', () => {
  let component: SendCerComponent;
  let fixture: ComponentFixture<SendCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendCerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
