import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountHomeAddressInfoComponent } from './account-home-address-info.component';

describe('AccountHomeAddressInfoComponent', () => {
  let component: AccountHomeAddressInfoComponent;
  let fixture: ComponentFixture<AccountHomeAddressInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHomeAddressInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountHomeAddressInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
