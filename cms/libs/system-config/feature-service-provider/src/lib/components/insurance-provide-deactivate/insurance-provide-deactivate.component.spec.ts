import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceProvideDeactivateComponent } from './insurance-provide-deactivate.component';

describe('InsuranceProvideDeactivateComponent', () => {
  let component: InsuranceProvideDeactivateComponent;
  let fixture: ComponentFixture<InsuranceProvideDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceProvideDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceProvideDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
