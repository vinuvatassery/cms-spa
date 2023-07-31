import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsEditDetailFormComponent } from './dental-premiums-edit-detail-form.component';

describe('DentalPremiumsEditDetailFormComponent', () => {
  let component: DentalPremiumsEditDetailFormComponent;
  let fixture: ComponentFixture<DentalPremiumsEditDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsEditDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsEditDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
