import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingCoordinationPageComponent } from './housing-coordination-page.component';

describe('HousingCoordinationPageComponent', () => {
  let component: HousingCoordinationPageComponent;
  let fixture: ComponentFixture<HousingCoordinationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousingCoordinationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingCoordinationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
