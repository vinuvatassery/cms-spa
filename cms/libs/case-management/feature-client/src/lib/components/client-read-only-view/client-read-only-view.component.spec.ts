import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReadOnlyViewComponent } from './client-read-only-view.component';

describe('ClientReadOnlyViewComponent', () => {
  let component: ClientReadOnlyViewComponent;
  let fixture: ComponentFixture<ClientReadOnlyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientReadOnlyViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReadOnlyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
