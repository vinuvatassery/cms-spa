import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HivVerificationComponent } from './hiv-verification.component';

describe('HivVerificationComponent', () => {
  let component: HivVerificationComponent;
  let fixture: ComponentFixture<HivVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HivVerificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HivVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
