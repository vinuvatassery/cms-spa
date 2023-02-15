import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCarrierContactInfoComponent } from './medical-carrier-contact-info.component';

describe('MedicalCarrierContactInfoComponent', () => {
  let component: MedicalCarrierContactInfoComponent;
  let fixture: ComponentFixture<MedicalCarrierContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalCarrierContactInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalCarrierContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
