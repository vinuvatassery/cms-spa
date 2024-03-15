import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalProvidersDeleteComponent } from './medical-providers-delete.component';

describe('MedicalProvidersDeleteComponent', () => {
  let component: MedicalProvidersDeleteComponent;
  let fixture: ComponentFixture<MedicalProvidersDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalProvidersDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalProvidersDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
