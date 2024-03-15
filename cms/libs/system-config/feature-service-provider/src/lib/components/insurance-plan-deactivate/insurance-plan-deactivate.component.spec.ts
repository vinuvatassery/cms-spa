import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancePlanDeactivateComponent } from './insurance-plan-deactivate.component';

describe('InsurancePlanDeactivateComponent', () => {
  let component: InsurancePlanDeactivateComponent;
  let fixture: ComponentFixture<InsurancePlanDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsurancePlanDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsurancePlanDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
