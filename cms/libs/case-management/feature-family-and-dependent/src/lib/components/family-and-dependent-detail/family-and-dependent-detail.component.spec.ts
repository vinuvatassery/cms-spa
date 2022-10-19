import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAndDependentDetailComponent } from './family-and-dependent-detail.component';

describe('FamilyAndDependentDetailComponent', () => {
  let component: FamilyAndDependentDetailComponent;
  let fixture: ComponentFixture<FamilyAndDependentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyAndDependentDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyAndDependentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
