import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivatePharmaciesComponent } from './reactivate-pharmacies.component';

describe('ReactivatePharmaciesComponent', () => {
  let component: ReactivatePharmaciesComponent;
  let fixture: ComponentFixture<ReactivatePharmaciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactivatePharmaciesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactivatePharmaciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
