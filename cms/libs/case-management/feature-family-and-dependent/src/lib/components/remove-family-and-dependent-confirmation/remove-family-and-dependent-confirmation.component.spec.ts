import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFamilyAndDependentConfirmationComponent } from './remove-family-and-dependent-confirmation.component';

describe('RemoveFamilyAndDependentConfirmationComponent', () => {
  let component: RemoveFamilyAndDependentConfirmationComponent;
  let fixture: ComponentFixture<RemoveFamilyAndDependentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveFamilyAndDependentConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      RemoveFamilyAndDependentConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
