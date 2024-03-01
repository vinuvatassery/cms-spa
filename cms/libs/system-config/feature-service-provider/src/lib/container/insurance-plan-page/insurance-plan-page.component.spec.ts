import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancePlanPageComponent } from './insurance-plan-page.component';

describe('InsurancePlanPageComponent', () => {
  let component: InsurancePlanPageComponent;
  let fixture: ComponentFixture<InsurancePlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsurancePlanPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsurancePlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
