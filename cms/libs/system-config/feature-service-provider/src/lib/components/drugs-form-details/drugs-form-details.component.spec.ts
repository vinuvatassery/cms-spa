import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrugsFormDetailsComponent } from './drugs-form-details.component';

describe('DrugsFormDetailsComponent', () => {
  let component: DrugsFormDetailsComponent;
  let fixture: ComponentFixture<DrugsFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugsFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
