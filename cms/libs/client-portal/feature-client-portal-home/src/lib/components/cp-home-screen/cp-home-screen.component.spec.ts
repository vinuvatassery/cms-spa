import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpHomeScreenComponent } from './cp-home-screen.component';

describe('CpHomeScreenComponent', () => {
  let component: CpHomeScreenComponent;
  let fixture: ComponentFixture<CpHomeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpHomeScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpHomeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
