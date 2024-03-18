import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesAndPermissionsDetailsPageComponent } from './roles-and-permissions-details-page.component';

describe('RolesAndPermissionsDetailsPageComponent', () => {
  let component: RolesAndPermissionsDetailsPageComponent;
  let fixture: ComponentFixture<RolesAndPermissionsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesAndPermissionsDetailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesAndPermissionsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
