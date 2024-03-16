import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceProvideListComponent } from './insurance-provide-list.component';

describe('InsuranceProvideListComponent', () => {
  let component: InsuranceProvideListComponent;
  let fixture: ComponentFixture<InsuranceProvideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceProvideListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceProvideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
