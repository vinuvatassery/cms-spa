import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrugsReassignComponent } from './drugs-reassign.component';

describe('DrugsReassignComponent', () => {
  let component: DrugsReassignComponent;
  let fixture: ComponentFixture<DrugsReassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugsReassignComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsReassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
