import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpMyProfileComponent } from './cp-my-profile.component';

describe('CpMyProfileComponent', () => {
  let component: CpMyProfileComponent;
  let fixture: ComponentFixture<CpMyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpMyProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
