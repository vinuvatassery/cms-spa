import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmsTextTemplateNewFormComponent } from './sms-text-template-new-form.component';

describe('SmsTextTemplateNewFormComponent', () => {
  let component: SmsTextTemplateNewFormComponent;
  let fixture: ComponentFixture<SmsTextTemplateNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmsTextTemplateNewFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsTextTemplateNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
