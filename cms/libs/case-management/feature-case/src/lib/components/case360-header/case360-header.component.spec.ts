import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Case360HeaderComponent } from './case360-header.component';

describe('Case360HeaderComponent', () => {
  let component: Case360HeaderComponent;
  let fixture: ComponentFixture<Case360HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Case360HeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Case360HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
