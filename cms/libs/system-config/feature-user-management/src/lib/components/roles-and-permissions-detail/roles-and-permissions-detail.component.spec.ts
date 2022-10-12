import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAndPermissionsDetailComponent } from './roles-and-permissions-detail.component';

describe('RolesAndPermissionsDetailComponent', () => {
  let component: RolesAndPermissionsDetailComponent;
  let fixture: ComponentFixture<RolesAndPermissionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesAndPermissionsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndPermissionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
