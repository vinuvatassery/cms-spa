import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNavigationComponent } from './case-navigation.component';

describe('CaseNavigationComponent', () => {
  let component: CaseNavigationComponent;
  let fixture: ComponentFixture<CaseNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseNavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
