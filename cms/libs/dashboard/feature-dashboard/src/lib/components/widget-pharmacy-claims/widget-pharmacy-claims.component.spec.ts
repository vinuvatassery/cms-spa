import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetPharmacyClaimsComponent } from './widget-pharmacy-claims.component';

describe('WidgetPharmacyClaimsComponent', () => {
  let component: WidgetPharmacyClaimsComponent;
  let fixture: ComponentFixture<WidgetPharmacyClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetPharmacyClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetPharmacyClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
