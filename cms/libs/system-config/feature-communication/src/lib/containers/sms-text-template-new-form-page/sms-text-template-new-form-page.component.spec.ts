import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmsTextTemplateNewFormPageComponent } from './sms-text-template-new-form-page.component';

describe('SmsTextTemplateNewFormPageComponent', () => {
  let component: SmsTextTemplateNewFormPageComponent;
  let fixture: ComponentFixture<SmsTextTemplateNewFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmsTextTemplateNewFormPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsTextTemplateNewFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
