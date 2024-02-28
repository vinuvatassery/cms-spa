import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CmsPharmacyClaimsDetailComponent } from './cms-pharmacy-claims-detail.component';

describe('CmsPharmacyClaimsDetailComponent', () => {
  let component: CmsPharmacyClaimsDetailComponent;
  let fixture: ComponentFixture<CmsPharmacyClaimsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmsPharmacyClaimsDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsPharmacyClaimsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
