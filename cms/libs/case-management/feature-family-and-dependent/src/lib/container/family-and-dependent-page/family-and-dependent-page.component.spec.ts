import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAndDependentPageComponent } from './family-and-dependent-page.component';

describe('FamilyAndDependentPageComponent', () => {
  let component: FamilyAndDependentPageComponent;
  let fixture: ComponentFixture<FamilyAndDependentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyAndDependentPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyAndDependentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
