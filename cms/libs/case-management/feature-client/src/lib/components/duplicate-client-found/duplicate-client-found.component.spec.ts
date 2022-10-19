import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateClientFoundComponent } from './duplicate-client-found.component';

describe('DuplicateClientFoundComponent', () => {
  let component: DuplicateClientFoundComponent;
  let fixture: ComponentFixture<DuplicateClientFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicateClientFoundComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateClientFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
