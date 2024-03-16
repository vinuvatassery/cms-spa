import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalProvidersFormDetailsComponent } from './medical-providers-form-details.component';

describe('MedicalProvidersFormDetailsComponent', () => {
  let component: MedicalProvidersFormDetailsComponent;
  let fixture: ComponentFixture<MedicalProvidersFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalProvidersFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalProvidersFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
