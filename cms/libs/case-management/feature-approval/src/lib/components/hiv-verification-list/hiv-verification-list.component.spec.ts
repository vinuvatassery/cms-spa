import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HivVerificationListComponent } from './hiv-verification-list.component';

describe('HivVerificationListComponent', () => {
  let component: HivVerificationListComponent;
  let fixture: ComponentFixture<HivVerificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HivVerificationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HivVerificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
