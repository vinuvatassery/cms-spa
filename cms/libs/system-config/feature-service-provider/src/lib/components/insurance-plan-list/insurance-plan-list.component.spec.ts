import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancePlanListComponent } from './insurance-plan-list.component';

describe('InsurancePlanListComponent', () => {
  let component: InsurancePlanListComponent;
  let fixture: ComponentFixture<InsurancePlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsurancePlanListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsurancePlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
