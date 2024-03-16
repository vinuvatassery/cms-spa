import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EidLifetimePeriodPageComponent } from './eid-lifetime-period-page.component';

describe('EidLifetimePeriodPageComponent', () => {
  let component: EidLifetimePeriodPageComponent;
  let fixture: ComponentFixture<EidLifetimePeriodPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EidLifetimePeriodPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EidLifetimePeriodPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
