import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateDuplicateComponent } from './email-template-duplicate.component';

describe('EmailTemplateDuplicateComponent', () => {
  let component: EmailTemplateDuplicateComponent;
  let fixture: ComponentFixture<EmailTemplateDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateDuplicateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
