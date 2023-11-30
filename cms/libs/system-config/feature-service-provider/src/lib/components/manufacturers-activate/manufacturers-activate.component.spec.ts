import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturersActivateComponent } from './manufacturers-activate.component';

describe('ManufacturersActivateComponent', () => {
  let component: ManufacturersActivateComponent;
  let fixture: ComponentFixture<ManufacturersActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersActivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturersActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
