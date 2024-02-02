import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebServiceLogsComponent } from './web-service-logs.component';

describe('WebServiceLogsComponent', () => {
  let component: WebServiceLogsComponent;
  let fixture: ComponentFixture<WebServiceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebServiceLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebServiceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
