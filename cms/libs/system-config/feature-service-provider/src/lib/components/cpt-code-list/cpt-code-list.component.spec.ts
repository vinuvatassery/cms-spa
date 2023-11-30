import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptCodeListComponent } from './cpt-code-list.component';

describe('CptCodeListComponent', () => {
  let component: CptCodeListComponent;
  let fixture: ComponentFixture<CptCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CptCodeListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
