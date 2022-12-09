import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewSexAtBirthComponent } from './client-edit-view-sex-at-birth.component';

describe('ClientEditViewSexAtBirthComponent', () => {
  let component: ClientEditViewSexAtBirthComponent;
  let fixture: ComponentFixture<ClientEditViewSexAtBirthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewSexAtBirthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewSexAtBirthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
