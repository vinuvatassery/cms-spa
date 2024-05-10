import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAssignedRoleComponentComponent } from './user-assigned-role.component.component';

describe('UserAssignedRoleComponentComponent', () => {
  let component: UserAssignedRoleComponentComponent;
  let fixture: ComponentFixture<UserAssignedRoleComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAssignedRoleComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAssignedRoleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
