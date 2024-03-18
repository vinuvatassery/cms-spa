import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateLeavePageComponent } from './email-template-leave-page.component';

describe('EmailTemplateLeavePageComponent', () => {
  let component: EmailTemplateLeavePageComponent;
  let fixture: ComponentFixture<EmailTemplateLeavePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateLeavePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateLeavePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
