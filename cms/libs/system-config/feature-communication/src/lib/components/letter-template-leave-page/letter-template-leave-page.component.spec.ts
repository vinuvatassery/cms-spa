import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplateLeavePageComponent } from './letter-template-leave-page.component';

describe('LetterTemplateLeavePageComponent', () => {
  let component: LetterTemplateLeavePageComponent;
  let fixture: ComponentFixture<LetterTemplateLeavePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplateLeavePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplateLeavePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
