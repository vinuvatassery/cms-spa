import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePharmacyComponent } from './remove-pharmacy.component';

describe('RemovePharmacyComponent', () => {
  let component: RemovePharmacyComponent;
  let fixture: ComponentFixture<RemovePharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemovePharmacyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
