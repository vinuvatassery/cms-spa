import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionAssignmentPageComponent } from './region-assignment-page.component';

describe('RegionAssignmentPageComponent', () => {
  let component: RegionAssignmentPageComponent;
  let fixture: ComponentFixture<RegionAssignmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegionAssignmentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegionAssignmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
