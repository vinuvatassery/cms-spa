import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisenrollClientComponent } from './disenroll-client.component';

describe('DisenrollClientComponent', () => {
  let component: DisenrollClientComponent;
  let fixture: ComponentFixture<DisenrollClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisenrollClientComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisenrollClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
