import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmsTextTemplatePageComponent } from './sms-text-template-page.component';

describe('SmsTextTemplatePageComponent', () => {
  let component: SmsTextTemplatePageComponent;
  let fixture: ComponentFixture<SmsTextTemplatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmsTextTemplatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsTextTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
