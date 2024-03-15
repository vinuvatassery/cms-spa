import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthcareProviderListComponent } from './healthcare-provider-list.component';

describe('HealthcareProviderListComponent', () => {
  let component: HealthcareProviderListComponent;
  let fixture: ComponentFixture<HealthcareProviderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareProviderListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthcareProviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
