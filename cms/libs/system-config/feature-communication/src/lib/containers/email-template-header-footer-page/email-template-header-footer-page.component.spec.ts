import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateHeaderFooterPageComponent } from './email-template-header-footer-page.component';

describe('EmailTemplateHeaderFooterPageComponent', () => {
  let component: EmailTemplateHeaderFooterPageComponent;
  let fixture: ComponentFixture<EmailTemplateHeaderFooterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateHeaderFooterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateHeaderFooterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
