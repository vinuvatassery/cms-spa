import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmaciesPageComponent } from './pharmacies-page.component';

describe('PharmaciesPageComponent', () => {
  let component: PharmaciesPageComponent;
  let fixture: ComponentFixture<PharmaciesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmaciesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmaciesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
