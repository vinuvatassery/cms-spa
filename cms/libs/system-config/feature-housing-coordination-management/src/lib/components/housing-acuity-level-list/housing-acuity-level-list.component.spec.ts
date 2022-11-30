import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingAcuityLevelListComponent } from './housing-acuity-level-list.component';

describe('HousingAcuityLevelListComponent', () => {
  let component: HousingAcuityLevelListComponent;
  let fixture: ComponentFixture<HousingAcuityLevelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousingAcuityLevelListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingAcuityLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
