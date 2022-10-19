import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cd4CountComponent } from './cd4-count.component';

describe('Cd4CountComponent', () => {
  let component: Cd4CountComponent;
  let fixture: ComponentFixture<Cd4CountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cd4CountComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cd4CountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
