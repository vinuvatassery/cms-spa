import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewNotificationTemplatesComponent } from './preview-notification-templates.component';

describe('PreviewNotificationTemplatesComponent', () => {
  let component: PreviewNotificationTemplatesComponent;
  let fixture: ComponentFixture<PreviewNotificationTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewNotificationTemplatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewNotificationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
