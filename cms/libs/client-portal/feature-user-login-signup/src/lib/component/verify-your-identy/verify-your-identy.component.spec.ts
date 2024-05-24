import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyYourIdentyComponent } from './verify-your-identy.component';

describe('VerifyYourIdentyComponent', () => {
  let component: VerifyYourIdentyComponent;
  let fixture: ComponentFixture<VerifyYourIdentyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyYourIdentyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyYourIdentyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
