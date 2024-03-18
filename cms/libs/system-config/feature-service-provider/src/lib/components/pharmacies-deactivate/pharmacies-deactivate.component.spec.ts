import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmaciesDeactivateComponent } from './pharmacies-deactivate.component';

describe('PharmaciesDeactivateComponent', () => {
  let component: PharmaciesDeactivateComponent;
  let fixture: ComponentFixture<PharmaciesDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmaciesDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmaciesDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
