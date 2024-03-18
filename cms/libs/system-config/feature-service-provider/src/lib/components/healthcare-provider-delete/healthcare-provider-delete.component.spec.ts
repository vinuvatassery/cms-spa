import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthcareProviderDeleteComponent } from './healthcare-provider-delete.component';

describe('HealthcareProviderDeleteComponent', () => {
  let component: HealthcareProviderDeleteComponent;
  let fixture: ComponentFixture<HealthcareProviderDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareProviderDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcareProviderDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
