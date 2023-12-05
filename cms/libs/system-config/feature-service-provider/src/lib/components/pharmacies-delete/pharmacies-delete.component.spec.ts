import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmaciesDeleteComponent } from './pharmacies-delete.component';

describe('PharmaciesDeleteComponent', () => {
  let component: PharmaciesDeleteComponent;
  let fixture: ComponentFixture<PharmaciesDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmaciesDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmaciesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
