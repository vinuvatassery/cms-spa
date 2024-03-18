import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrugsDeactivateComponent } from './drugs-deactivate.component';

describe('DrugsDeactivateComponent', () => {
  let component: DrugsDeactivateComponent;
  let fixture: ComponentFixture<DrugsDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugsDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
