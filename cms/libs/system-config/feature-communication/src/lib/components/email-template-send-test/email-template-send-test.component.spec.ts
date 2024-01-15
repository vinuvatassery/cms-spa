import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateSendTestComponent } from './email-template-send-test.component';

describe('EmailTemplateSendTestComponent', () => {
  let component: EmailTemplateSendTestComponent;
  let fixture: ComponentFixture<EmailTemplateSendTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateSendTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateSendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
