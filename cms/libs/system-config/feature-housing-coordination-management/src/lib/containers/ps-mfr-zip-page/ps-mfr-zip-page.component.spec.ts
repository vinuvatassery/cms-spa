import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsMfrZipPageComponent } from './ps-mfr-zip-page.component';

describe('PsMfrZipPageComponent', () => {
  let component: PsMfrZipPageComponent;
  let fixture: ComponentFixture<PsMfrZipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PsMfrZipPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PsMfrZipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
