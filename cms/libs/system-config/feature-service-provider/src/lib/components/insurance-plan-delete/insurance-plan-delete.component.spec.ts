import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancePlanDeleteComponent } from './insurance-plan-delete.component';

describe('InsurancePlanDeleteComponent', () => {
  let component: InsurancePlanDeleteComponent;
  let fixture: ComponentFixture<InsurancePlanDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsurancePlanDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsurancePlanDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
