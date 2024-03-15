import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateHeaderFooterComponent } from './email-template-header-footer.component';

describe('EmailTemplateHeaderFooterComponent', () => {
  let component: EmailTemplateHeaderFooterComponent;
  let fixture: ComponentFixture<EmailTemplateHeaderFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateHeaderFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateHeaderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
