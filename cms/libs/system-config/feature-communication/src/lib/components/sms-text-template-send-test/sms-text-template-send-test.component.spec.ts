import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmsTextTemplateSendTestComponent } from './sms-text-template-send-test.component';

describe('SmsTextTemplateSendTestComponent', () => {
  let component: SmsTextTemplateSendTestComponent;
  let fixture: ComponentFixture<SmsTextTemplateSendTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmsTextTemplateSendTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsTextTemplateSendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
