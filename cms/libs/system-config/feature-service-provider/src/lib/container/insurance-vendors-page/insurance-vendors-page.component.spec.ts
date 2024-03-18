import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceVendorsPageComponent } from './insurance-vendors-page.component';

describe('InsuranceVendorsPageComponent', () => {
  let component: InsuranceVendorsPageComponent;
  let fixture: ComponentFixture<InsuranceVendorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceVendorsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceVendorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
