import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthcareProviderDeactivateComponent } from './healthcare-provider-deactivate.component';

describe('HealthcareProviderDeactivateComponent', () => {
  let component: HealthcareProviderDeactivateComponent;
  let fixture: ComponentFixture<HealthcareProviderDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareProviderDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcareProviderDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
