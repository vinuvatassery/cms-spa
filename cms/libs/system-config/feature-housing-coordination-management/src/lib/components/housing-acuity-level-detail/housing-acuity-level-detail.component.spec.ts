import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingAcuityLevelDetailComponent } from './housing-acuity-level-detail.component';

describe('HousingAcuityLevelDetailComponent', () => {
  let component: HousingAcuityLevelDetailComponent;
  let fixture: ComponentFixture<HousingAcuityLevelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousingAcuityLevelDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingAcuityLevelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
