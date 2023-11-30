import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptCodeDeactivateComponent } from './cpt-code-deactivate.component';

describe('CptCodeDeactivateComponent', () => {
  let component: CptCodeDeactivateComponent;
  let fixture: ComponentFixture<CptCodeDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CptCodeDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptCodeDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
