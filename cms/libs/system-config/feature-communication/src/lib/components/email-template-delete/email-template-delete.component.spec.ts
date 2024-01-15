import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateDeleteComponent } from './email-template-delete.component';

describe('EmailTemplateDeleteComponent', () => {
  let component: EmailTemplateDeleteComponent;
  let fixture: ComponentFixture<EmailTemplateDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplateDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
