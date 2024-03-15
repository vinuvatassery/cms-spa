import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceVendorsDeleteComponent } from './insurance-vendors-delete.component';

describe('InsuranceVendorsDeleteComponent', () => {
  let component: InsuranceVendorsDeleteComponent;
  let fixture: ComponentFixture<InsuranceVendorsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceVendorsDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceVendorsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
