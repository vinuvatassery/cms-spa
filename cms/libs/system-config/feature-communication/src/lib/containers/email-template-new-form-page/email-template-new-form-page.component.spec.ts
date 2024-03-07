import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateNewFormPageComponent } from './email-template-new-form-page.component';

describe('EmailTemplateNewFormPageComponent', () => {
  let component: EmailTemplateNewFormPageComponent;
  let fixture: ComponentFixture<EmailTemplateNewFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateNewFormPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateNewFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
