import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalPremiumsAllPaymentsListComponent } from './medical-premiums-all-payments-list.component';

describe('MedicalPremiumsAllPaymentsListComponent', () => {
  let component: MedicalPremiumsAllPaymentsListComponent;
  let fixture: ComponentFixture<MedicalPremiumsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
