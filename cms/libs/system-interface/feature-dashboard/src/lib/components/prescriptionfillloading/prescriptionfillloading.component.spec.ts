import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescriptionfillloadingComponent } from './prescriptionfillloading.component';

describe('PrescriptionfillloadingComponent', () => {
  let component: PrescriptionfillloadingComponent;
  let fixture: ComponentFixture<PrescriptionfillloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionfillloadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionfillloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
