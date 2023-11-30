import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturersFormDetailsComponent } from './manufacturers-form-details.component';

describe('ManufacturersFormDetailsComponent', () => {
  let component: ManufacturersFormDetailsComponent;
  let fixture: ComponentFixture<ManufacturersFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturersFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
