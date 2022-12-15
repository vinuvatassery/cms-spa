import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewDisabilityComponent } from './client-edit-view-disability.component';

describe('ClientEditViewDisabilityComponent', () => {
  let component: ClientEditViewDisabilityComponent;
  let fixture: ComponentFixture<ClientEditViewDisabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewDisabilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewDisabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
