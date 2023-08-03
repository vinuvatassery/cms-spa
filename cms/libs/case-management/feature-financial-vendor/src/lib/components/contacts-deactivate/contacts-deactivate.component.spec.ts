import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsDeactivateComponent } from './contacts-deactivate.component';

describe('ContactsDeactivateComponent', () => {
  let component: ContactsDeactivateComponent;
  let fixture: ComponentFixture<ContactsDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
