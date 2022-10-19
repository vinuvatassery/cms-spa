import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAndPermissionsListComponent } from './roles-and-permissions-list.component';

describe('RolesAndPermissionsListComponent', () => {
  let component: RolesAndPermissionsListComponent;
  let fixture: ComponentFixture<RolesAndPermissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesAndPermissionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndPermissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
