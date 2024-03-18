import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientNotificationDefaultsPageComponent } from './client-notification-defaults-page.component';

describe('ClientNotificationDefaultsPageComponent', () => {
  let component: ClientNotificationDefaultsPageComponent;
  let fixture: ComponentFixture<ClientNotificationDefaultsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientNotificationDefaultsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNotificationDefaultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
