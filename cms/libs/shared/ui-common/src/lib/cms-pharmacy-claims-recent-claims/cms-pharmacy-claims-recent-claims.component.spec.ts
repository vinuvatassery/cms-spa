import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CmsPharmacyClaimsRecentClaimsComponent } from './cms-pharmacy-claims-recent-claims.component';

describe('CmsPharmacyClaimsRecentClaimsComponent', () => {
  let component: CmsPharmacyClaimsRecentClaimsComponent;
  let fixture: ComponentFixture<CmsPharmacyClaimsRecentClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmsPharmacyClaimsRecentClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsPharmacyClaimsRecentClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
