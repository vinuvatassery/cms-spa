import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewSexualIdentityComponent } from './client-edit-view-sexual-identity.component';

describe('ClientEditViewSexualIdentityComponent', () => {
  let component: ClientEditViewSexualIdentityComponent;
  let fixture: ComponentFixture<ClientEditViewSexualIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewSexualIdentityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewSexualIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
