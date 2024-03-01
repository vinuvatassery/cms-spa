import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplatePageComponent } from './email-template-page.component';

describe('EmailTemplatePageComponent', () => {
  let component: EmailTemplatePageComponent;
  let fixture: ComponentFixture<EmailTemplatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
