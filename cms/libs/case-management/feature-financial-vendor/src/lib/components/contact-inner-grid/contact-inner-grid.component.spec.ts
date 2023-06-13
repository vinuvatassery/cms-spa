import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInnerGridComponent } from './contact-inner-grid.component';

describe('ContactInnerGridComponent', () => {
  let component: ContactInnerGridComponent;
  let fixture: ComponentFixture<ContactInnerGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactInnerGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactInnerGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
