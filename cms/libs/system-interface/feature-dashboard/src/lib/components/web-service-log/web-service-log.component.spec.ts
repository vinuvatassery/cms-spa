import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebServiceLogComponent } from './web-service-log.component';

describe('WebServiceLogComponent', () => {
  let component: WebServiceLogComponent;
  let fixture: ComponentFixture<WebServiceLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebServiceLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebServiceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
