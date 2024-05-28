import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpLandingScreenComponent } from './cp-landing-screen.component';

describe('CpLandingScreenComponent', () => {
  let component: CpLandingScreenComponent;
  let fixture: ComponentFixture<CpLandingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpLandingScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpLandingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
