import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewGenderComponent } from './client-edit-view-gender.component';

describe('ClientEditViewGenderComponent', () => {
  let component: ClientEditViewGenderComponent;
  let fixture: ComponentFixture<ClientEditViewGenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewGenderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
