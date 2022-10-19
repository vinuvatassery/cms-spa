import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewComponent } from './client-edit-view.component';

describe('ClientEditViewComponent', () => {
  let component: ClientEditViewComponent;
  let fixture: ComponentFixture<ClientEditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
