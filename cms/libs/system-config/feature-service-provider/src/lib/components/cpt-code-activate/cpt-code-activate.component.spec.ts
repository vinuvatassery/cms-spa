import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptCodeActivateComponent } from './cpt-code-activate.component';

describe('CptCodeActivateComponent', () => {
  let component: CptCodeActivateComponent;
  let fixture: ComponentFixture<CptCodeActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CptCodeActivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptCodeActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
