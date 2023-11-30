import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptCodeDeleteComponent } from './cpt-code-delete.component';

describe('CptCodeDeleteComponent', () => {
  let component: CptCodeDeleteComponent;
  let fixture: ComponentFixture<CptCodeDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CptCodeDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptCodeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
