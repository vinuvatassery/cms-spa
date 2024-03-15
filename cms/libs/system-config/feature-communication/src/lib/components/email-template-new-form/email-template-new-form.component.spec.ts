import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateNewFormComponent } from './email-template-new-form.component';

describe('EmailTemplateNewFormComponent', () => {
  let component: EmailTemplateNewFormComponent;
  let fixture: ComponentFixture<EmailTemplateNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateNewFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
