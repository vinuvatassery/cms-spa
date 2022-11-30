import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionAssignmentDetailComponent } from './region-assignment-detail.component';

describe('RegionAssignmentDetailComponent', () => {
  let component: RegionAssignmentDetailComponent;
  let fixture: ComponentFixture<RegionAssignmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionAssignmentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionAssignmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
