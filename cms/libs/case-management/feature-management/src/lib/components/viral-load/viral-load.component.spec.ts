import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViralLoadComponent } from './viral-load.component';

describe('ViralLoadComponent', () => {
  let component: ViralLoadComponent;
  let fixture: ComponentFixture<ViralLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViralLoadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViralLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
