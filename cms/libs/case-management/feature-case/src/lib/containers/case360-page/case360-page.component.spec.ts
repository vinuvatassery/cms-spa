import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Case360PageComponent } from './case360-page.component';

describe('Case360PageComponent', () => {
  let component: Case360PageComponent;
  let fixture: ComponentFixture<Case360PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Case360PageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Case360PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
