import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalProvidersListComponent } from './medical-providers-list.component';

describe('MedicalProvidersListComponent', () => {
  let component: MedicalProvidersListComponent;
  let fixture: ComponentFixture<MedicalProvidersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalProvidersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalProvidersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
