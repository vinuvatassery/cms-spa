import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTextTemplateListComponent } from './sms-text-template-list.component';

describe('SmsTextTemplateListComponent', () => {
  let component: SmsTextTemplateListComponent;
  let fixture: ComponentFixture<SmsTextTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsTextTemplateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsTextTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
