import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrugsActivateComponent } from './drugs-activate.component';

describe('DrugsActivateComponent', () => {
  let component: DrugsActivateComponent;
  let fixture: ComponentFixture<DrugsActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugsActivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
