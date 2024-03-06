import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientRecordSentComponent } from './client-record-sent.component';

describe('ClientRecordSentComponent', () => {
  let component: ClientRecordSentComponent;
  let fixture: ComponentFixture<ClientRecordSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientRecordSentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientRecordSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
