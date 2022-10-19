import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAndDependentListComponent } from './family-and-dependent-list.component';

describe('FamilyAndDependentListComponent', () => {
  let component: FamilyAndDependentListComponent;
  let fixture: ComponentFixture<FamilyAndDependentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyAndDependentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyAndDependentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
