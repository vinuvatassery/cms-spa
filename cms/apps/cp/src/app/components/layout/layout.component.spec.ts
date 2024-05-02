import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpLayoutComponent } from './layout.component';

describe('CpLayoutComponent', () => {
  let component: CpLayoutComponent;
  let fixture: ComponentFixture<CpLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
