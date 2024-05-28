import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpAccountSettingsComponent } from './cp-account-settings.component';

describe('CpAccountSettingsComponent', () => {
  let component: CpAccountSettingsComponent;
  let fixture: ComponentFixture<CpAccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpAccountSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
