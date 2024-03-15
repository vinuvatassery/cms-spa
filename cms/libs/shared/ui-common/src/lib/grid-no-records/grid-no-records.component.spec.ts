import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridNoRecordsComponent } from './grid-no-records.component';

describe('GridNoRecordsComponent', () => {
  let component: GridNoRecordsComponent;
  let fixture: ComponentFixture<GridNoRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridNoRecordsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridNoRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
