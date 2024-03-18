import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceVendorsDeactivateComponent } from './insurance-vendors-deactivate.component';

describe('InsuranceVendorsDeactivateComponent', () => {
  let component: InsuranceVendorsDeactivateComponent;
  let fixture: ComponentFixture<InsuranceVendorsDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceVendorsDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceVendorsDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
