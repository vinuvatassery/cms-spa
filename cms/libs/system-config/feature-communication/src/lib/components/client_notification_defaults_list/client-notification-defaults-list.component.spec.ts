import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientNotificationDefaultsListComponent } from './client-notification-defaults-list.component';

describe('ClientNotificationDefaultsListComponent', () => {
  let component: ClientNotificationDefaultsListComponent;
  let fixture: ComponentFixture<ClientNotificationDefaultsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientNotificationDefaultsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNotificationDefaultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
