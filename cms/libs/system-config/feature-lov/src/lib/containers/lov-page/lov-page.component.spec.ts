import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovPageComponent } from './lov-page.component';

describe('LovPageComponent', () => {
  let component: LovPageComponent;
  let fixture: ComponentFixture<LovPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LovPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LovPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
