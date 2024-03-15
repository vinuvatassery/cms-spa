import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceProvidePageComponent } from './insurance-provide-page.component';

describe('InsuranceProvidePageComponent', () => {
  let component: InsuranceProvidePageComponent;
  let fixture: ComponentFixture<InsuranceProvidePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceProvidePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceProvidePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
