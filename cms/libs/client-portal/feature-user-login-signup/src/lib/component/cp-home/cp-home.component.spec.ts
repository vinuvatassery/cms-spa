import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpHomeComponent } from './cp-home.component';

describe('CpHomeComponent', () => {
  let component: CpHomeComponent;
  let fixture: ComponentFixture<CpHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
