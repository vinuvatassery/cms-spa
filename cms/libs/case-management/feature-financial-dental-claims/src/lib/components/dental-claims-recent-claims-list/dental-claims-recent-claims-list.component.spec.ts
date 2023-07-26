import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsRecentClaimsListComponent } from './dental-claims-recent-claims-list.component';

describe('DentalClaimsRecentClaimsListComponent', () => {
  let component: DentalClaimsRecentClaimsListComponent;
  let fixture: ComponentFixture<DentalClaimsRecentClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsRecentClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsRecentClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
