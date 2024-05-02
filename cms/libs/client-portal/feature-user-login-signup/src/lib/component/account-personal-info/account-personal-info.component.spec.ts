import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountPersonalInfoComponent } from './account-personal-info.component';

describe('AccountPersonalInfoComponent', () => {
  let component: AccountPersonalInfoComponent;
  let fixture: ComponentFixture<AccountPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountPersonalInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
