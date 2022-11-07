import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateRolesAndPermissionsConfirmationComponent } from './deactivate-roles-and-permissions-confirmation.component';

describe('DeactivateRolesAndPermissionsConfirmationComponent', () => {
  let component: DeactivateRolesAndPermissionsConfirmationComponent;
  let fixture: ComponentFixture<DeactivateRolesAndPermissionsConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeactivateRolesAndPermissionsConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateRolesAndPermissionsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
