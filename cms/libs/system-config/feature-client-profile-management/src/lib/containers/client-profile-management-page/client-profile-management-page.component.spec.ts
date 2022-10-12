import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileManagementPageComponent } from './client-profile-management-page.component';

describe('ClientProfileManagementPageComponent', () => {
  let component: ClientProfileManagementPageComponent;
  let fixture: ComponentFixture<ClientProfileManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientProfileManagementPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProfileManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
