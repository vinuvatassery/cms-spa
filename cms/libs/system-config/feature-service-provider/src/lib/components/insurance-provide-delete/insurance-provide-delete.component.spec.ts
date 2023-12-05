import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceProvideDeleteComponent } from './insurance-provide-delete.component';

describe('InsuranceProvideDeleteComponent', () => {
  let component: InsuranceProvideDeleteComponent;
  let fixture: ComponentFixture<InsuranceProvideDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceProvideDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceProvideDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
