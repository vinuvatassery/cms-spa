import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturersPageComponent } from './manufacturers-page.component';

describe('ManufacturersPageComponent', () => {
  let component: ManufacturersPageComponent;
  let fixture: ComponentFixture<ManufacturersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufacturersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
