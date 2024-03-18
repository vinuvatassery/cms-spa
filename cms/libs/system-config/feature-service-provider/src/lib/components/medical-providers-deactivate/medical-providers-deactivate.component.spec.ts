import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalProvidersDeactivateComponent } from './medical-providers-deactivate.component';

describe('MedicalProvidersDeactivateComponent', () => {
  let component: MedicalProvidersDeactivateComponent;
  let fixture: ComponentFixture<MedicalProvidersDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalProvidersDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalProvidersDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
