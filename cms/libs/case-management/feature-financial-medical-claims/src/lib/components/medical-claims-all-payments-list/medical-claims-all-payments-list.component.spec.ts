import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalClaimsAllPaymentsListComponent } from './medical-claims-all-payments-list.component';

describe('MedicalClaimsAllPaymentsListComponent', () => {
  let component: MedicalClaimsAllPaymentsListComponent;
  let fixture: ComponentFixture<MedicalClaimsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
