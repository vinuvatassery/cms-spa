import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsRouterBatchPageComponent } from './medical-claims-router-batch-page.component';

describe('MedicalClaimsRouterPageComponent', () => {
  let component: MedicalClaimsRouterBatchPageComponent;
  let fixture: ComponentFixture<MedicalClaimsRouterBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsRouterBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsRouterBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
