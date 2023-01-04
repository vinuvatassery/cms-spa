import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewTransgenderComponent } from './client-edit-view-transgender.component';

describe('ClientEditViewTransgenderComponent', () => {
  let component: ClientEditViewTransgenderComponent;
  let fixture: ComponentFixture<ClientEditViewTransgenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewTransgenderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewTransgenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
