import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastVisitedCasesComponent } from './last-visited-cases.component';

describe('LastVisitedCasesComponent', () => {
  let component: LastVisitedCasesComponent;
  let fixture: ComponentFixture<LastVisitedCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastVisitedCasesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastVisitedCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
