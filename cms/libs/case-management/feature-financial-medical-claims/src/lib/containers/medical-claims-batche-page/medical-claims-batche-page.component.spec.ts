import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchePageComponent } from './medical-claims-batche-page.component';

describe('MedicalClaimsBatchePageComponent', () => {
  let component: MedicalClaimsBatchePageComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
