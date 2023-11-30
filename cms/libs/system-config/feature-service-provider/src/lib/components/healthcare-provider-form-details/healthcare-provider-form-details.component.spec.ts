import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthcareProviderFormDetailsComponent } from './healthcare-provider-form-details.component';

describe('HealthcareProviderFormDetailsComponent', () => {
  let component: HealthcareProviderFormDetailsComponent;
  let fixture: ComponentFixture<HealthcareProviderFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareProviderFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcareProviderFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
