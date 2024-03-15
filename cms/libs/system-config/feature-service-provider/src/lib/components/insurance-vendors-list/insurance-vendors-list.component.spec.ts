import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceVendorsListComponent } from './insurance-vendors-list.component';

describe('InsuranceVendorsListComponent', () => {
  let component: InsuranceVendorsListComponent;
  let fixture: ComponentFixture<InsuranceVendorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceVendorsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceVendorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
