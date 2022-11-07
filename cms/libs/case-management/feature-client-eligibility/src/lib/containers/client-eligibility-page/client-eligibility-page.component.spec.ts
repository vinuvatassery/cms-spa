import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEligibilityPageComponent } from './client-eligibility-page.component';

describe('ClientEligibilityPageComponent', () => {
  let component: ClientEligibilityPageComponent;
  let fixture: ComponentFixture<ClientEligibilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEligibilityPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEligibilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
