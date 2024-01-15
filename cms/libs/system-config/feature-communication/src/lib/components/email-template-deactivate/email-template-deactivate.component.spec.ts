import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateDeactivateComponent } from './email-template-deactivate.component';

describe('EmailTemplateDeactivateComponent', () => {
  let component: EmailTemplateDeactivateComponent;
  let fixture: ComponentFixture<EmailTemplateDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
