import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HivVerificationRequestComponent } from './hiv-verification-request.component';

describe('HivVerificationRequestComponent', () => {
  let component: HivVerificationRequestComponent;
  let fixture: ComponentFixture<HivVerificationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HivVerificationRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HivVerificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
