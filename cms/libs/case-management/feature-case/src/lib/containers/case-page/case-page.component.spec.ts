import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePageComponent } from './case-page.component';

describe('CasePageComponent', () => {
  let component: CasePageComponent;
  let fixture: ComponentFixture<CasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CasePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
