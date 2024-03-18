import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmaciesFormDetailsComponent } from './pharmacies-form-details.component';

describe('PharmaciesFormDetailsComponent', () => {
  let component: PharmaciesFormDetailsComponent;
  let fixture: ComponentFixture<PharmaciesFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmaciesFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmaciesFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
