import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturersDeleteComponent } from './manufacturers-delete.component';

describe('ManufacturersDeleteComponent', () => {
  let component: ManufacturersDeleteComponent;
  let fixture: ComponentFixture<ManufacturersDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturersDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
