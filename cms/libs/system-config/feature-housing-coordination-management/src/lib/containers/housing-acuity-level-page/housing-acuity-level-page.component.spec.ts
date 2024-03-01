import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HousingAcuityLevelPageComponent } from './housing-acuity-level-page.component';

describe('HousingAcuityLevelPageComponent', () => {
  let component: HousingAcuityLevelPageComponent;
  let fixture: ComponentFixture<HousingAcuityLevelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HousingAcuityLevelPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HousingAcuityLevelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
