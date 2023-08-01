import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsProcessListComponent } from './dental-claims-process-list.component';

describe('DentalClaimsProcessListComponent', () => {
  let component: DentalClaimsProcessListComponent;
  let fixture: ComponentFixture<DentalClaimsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
