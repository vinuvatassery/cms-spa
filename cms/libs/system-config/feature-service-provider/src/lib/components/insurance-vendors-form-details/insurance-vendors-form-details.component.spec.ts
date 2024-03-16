import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceVendorsFormDetailsComponent } from './insurance-vendors-form-details.component';

describe('InsuranceVendorsFormDetailsComponent', () => {
  let component: InsuranceVendorsFormDetailsComponent;
  let fixture: ComponentFixture<InsuranceVendorsFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceVendorsFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceVendorsFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
