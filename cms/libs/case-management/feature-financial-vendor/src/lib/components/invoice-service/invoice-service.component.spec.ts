import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceServiceComponent } from './invoice-service.component';

describe('InvoiceServiceComponent', () => {
  let component: InvoiceServiceComponent;
  let fixture: ComponentFixture<InvoiceServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
