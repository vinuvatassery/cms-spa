import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEligibilityComponent } from './client-eligibility.component';

describe('ClientEligibilityComponent', () => {
  let component: ClientEligibilityComponent;
  let fixture: ComponentFixture<ClientEligibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEligibilityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
