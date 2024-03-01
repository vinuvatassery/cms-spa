import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesAndPermissionsPageComponent } from './roles-and-permissions-page.component';

describe('RolesAndPermissionsPageComponent', () => {
  let component: RolesAndPermissionsPageComponent;
  let fixture: ComponentFixture<RolesAndPermissionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesAndPermissionsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesAndPermissionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
