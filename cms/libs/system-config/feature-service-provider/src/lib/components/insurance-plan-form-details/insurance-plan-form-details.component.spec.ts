import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancePlanFormDetailsComponent } from './insurance-plan-form-details.component';

describe('InsurancePlanFormDetailsComponent', () => {
  let component: InsurancePlanFormDetailsComponent;
  let fixture: ComponentFixture<InsurancePlanFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsurancePlanFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsurancePlanFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
