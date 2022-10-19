import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailPageComponent } from './case-detail-page.component';

describe('CaseDetailPageComponent', () => {
  let component: CaseDetailPageComponent;
  let fixture: ComponentFixture<CaseDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseDetailPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
