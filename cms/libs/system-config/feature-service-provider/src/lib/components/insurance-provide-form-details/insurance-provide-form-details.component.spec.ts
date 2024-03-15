import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceProvideFormDetailsComponent } from './insurance-provide-form-details.component';

describe('InsuranceProvideFormDetailsComponent', () => {
  let component: InsuranceProvideFormDetailsComponent;
  let fixture: ComponentFixture<InsuranceProvideFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceProvideFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceProvideFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
