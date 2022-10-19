import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEmployerConfirmationComponent } from './remove-employer-confirmation.component';

describe('RemoveEmployerConfirmationComponent', () => {
  let component: RemoveEmployerConfirmationComponent;
  let fixture: ComponentFixture<RemoveEmployerConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveEmployerConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveEmployerConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
