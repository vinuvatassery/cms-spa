import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptCodePageComponent } from './cpt-code-page.component';

describe('CptCodePageComponent', () => {
  let component: CptCodePageComponent;
  let fixture: ComponentFixture<CptCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CptCodePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
