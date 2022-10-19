import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAsPrimaryPharmacyComponent } from './set-as-primary-pharmacy.component';

describe('SetAsPrimaryPharmacyComponent', () => {
  let component: SetAsPrimaryPharmacyComponent;
  let fixture: ComponentFixture<SetAsPrimaryPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetAsPrimaryPharmacyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAsPrimaryPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
