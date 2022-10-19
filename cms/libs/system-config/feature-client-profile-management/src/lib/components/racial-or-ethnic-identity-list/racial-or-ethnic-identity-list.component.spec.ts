import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacialOrEthnicIdentityListComponent } from './racial-or-ethnic-identity-list.component';

describe('RacialOrEthnicIdentityListComponent', () => {
  let component: RacialOrEthnicIdentityListComponent;
  let fixture: ComponentFixture<RacialOrEthnicIdentityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacialOrEthnicIdentityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacialOrEthnicIdentityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
