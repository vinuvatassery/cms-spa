import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptCodeFormDetailsComponent } from './cpt-code-form-details.component';

describe('CptCodeFormDetailsComponent', () => {
  let component: CptCodeFormDetailsComponent;
  let fixture: ComponentFixture<CptCodeFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CptCodeFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptCodeFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
