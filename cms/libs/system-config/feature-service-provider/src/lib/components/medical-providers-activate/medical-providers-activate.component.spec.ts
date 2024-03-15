import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalProvidersActivateComponent } from './medical-providers-activate.component';

describe('MedicalProvidersActivateComponent', () => {
  let component: MedicalProvidersActivateComponent;
  let fixture: ComponentFixture<MedicalProvidersActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalProvidersActivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalProvidersActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
