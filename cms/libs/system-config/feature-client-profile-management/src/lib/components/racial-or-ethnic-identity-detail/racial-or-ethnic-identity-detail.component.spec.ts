import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacialOrEthnicIdentityDetailComponent } from './racial-or-ethnic-identity-detail.component';

describe('RacialOrEthnicIdentityDetailComponent', () => {
  let component: RacialOrEthnicIdentityDetailComponent;
  let fixture: ComponentFixture<RacialOrEthnicIdentityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacialOrEthnicIdentityDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacialOrEthnicIdentityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
