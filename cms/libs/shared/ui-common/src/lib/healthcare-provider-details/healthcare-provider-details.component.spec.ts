import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareProviderDetailsComponent } from './healthcare-provider-details.component';

describe('HealthcareProviderDetailsComponent', () => {
  let component: HealthcareProviderDetailsComponent;
  let fixture: ComponentFixture<HealthcareProviderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareProviderDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcareProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
