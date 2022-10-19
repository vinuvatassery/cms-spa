import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FplDetailComponent } from './fpl-detail.component';

describe('FplDetailComponent', () => {
  let component: FplDetailComponent;
  let fixture: ComponentFixture<FplDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FplDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FplDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
