import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialHandlingDetailComponent } from './special-handling-detail.component';

describe('SpecialHandlingDetailComponent', () => {
  let component: SpecialHandlingDetailComponent;
  let fixture: ComponentFixture<SpecialHandlingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialHandlingDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialHandlingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
