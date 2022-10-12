import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerDetailComponent } from './case-manager-detail.component';

describe('CaseManagerDetailComponent', () => {
  let component: CaseManagerDetailComponent;
  let fixture: ComponentFixture<CaseManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseManagerDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
