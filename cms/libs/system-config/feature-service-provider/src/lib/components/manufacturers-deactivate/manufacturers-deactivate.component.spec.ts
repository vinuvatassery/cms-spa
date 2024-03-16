import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturersDeactivateComponent } from './manufacturers-deactivate.component';

describe('ManufacturersDeactivateComponent', () => {
  let component: ManufacturersDeactivateComponent;
  let fixture: ComponentFixture<ManufacturersDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturersDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
