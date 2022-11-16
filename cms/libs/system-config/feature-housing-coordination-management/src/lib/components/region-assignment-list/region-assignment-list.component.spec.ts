import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionAssignmentListComponent } from './region-assignment-list.component';

describe('RegionAssignmentListComponent', () => {
  let component: RegionAssignmentListComponent;
  let fixture: ComponentFixture<RegionAssignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionAssignmentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
