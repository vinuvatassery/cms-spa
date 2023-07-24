import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsProcessListComponent } from './medical-claims-process-list.component';

describe('MedicalClaimsProcessListComponent', () => {
  let component: MedicalClaimsProcessListComponent;
  let fixture: ComponentFixture<MedicalClaimsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
