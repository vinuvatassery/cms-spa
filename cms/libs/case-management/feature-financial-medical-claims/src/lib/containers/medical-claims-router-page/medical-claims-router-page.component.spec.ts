import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsRouterPageComponent } from './medical-claims-router-page.component';

describe('MedicalClaimsRouterPageComponent', () => {
  let component: MedicalClaimsRouterPageComponent;
  let fixture: ComponentFixture<MedicalClaimsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
