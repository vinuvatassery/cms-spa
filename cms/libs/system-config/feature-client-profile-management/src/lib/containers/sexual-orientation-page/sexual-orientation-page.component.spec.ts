import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SexualOrientationPageComponent } from './sexual-orientation-page.component';

describe('SexualOrientationPageComponent', () => {
  let component: SexualOrientationPageComponent;
  let fixture: ComponentFixture<SexualOrientationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SexualOrientationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SexualOrientationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
