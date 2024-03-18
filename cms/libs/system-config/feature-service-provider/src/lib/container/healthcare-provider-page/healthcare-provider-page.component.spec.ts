import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthcareProviderPageComponent } from './healthcare-provider-page.component';

describe('HealthcareProviderPageComponent', () => {
  let component: HealthcareProviderPageComponent;
  let fixture: ComponentFixture<HealthcareProviderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareProviderPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcareProviderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
