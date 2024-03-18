import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalProvidersPageComponent } from './medical-providers-page.component';

describe('MedicalProvidersPageComponent', () => {
  let component: MedicalProvidersPageComponent;
  let fixture: ComponentFixture<MedicalProvidersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalProvidersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalProvidersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
