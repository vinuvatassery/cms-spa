import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAttachmentComponent } from './clients-attachment.component';

describe('ClientsAttachmentComponent', () => {
  let component: ClientsAttachmentComponent;
  let fixture: ComponentFixture<ClientsAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientsAttachmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
