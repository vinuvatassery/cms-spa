import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsDetailFormComponent } from './dental-claims-detail-form.component';

describe('DentalClaimsDetailFormComponent', () => {
  let component: DentalClaimsDetailFormComponent;
  let fixture: ComponentFixture<DentalClaimsDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
