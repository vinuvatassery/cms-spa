import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsProcessListComponent } from './pharmacy-claims-process-list.component';

describe('PharmacyClaimsProcessListComponent', () => {
  let component: PharmacyClaimsProcessListComponent;
  let fixture: ComponentFixture<PharmacyClaimsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
