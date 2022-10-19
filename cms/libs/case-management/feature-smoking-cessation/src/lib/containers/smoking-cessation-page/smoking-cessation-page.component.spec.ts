import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokingCessationPageComponent } from './smoking-cessation-page.component';

describe('SmokingCessationPageComponent', () => {
  let component: SmokingCessationPageComponent;
  let fixture: ComponentFixture<SmokingCessationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmokingCessationPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmokingCessationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
