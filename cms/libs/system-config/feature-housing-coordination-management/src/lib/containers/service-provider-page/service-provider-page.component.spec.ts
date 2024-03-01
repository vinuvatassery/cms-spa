import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceProviderPageComponent } from './service-provider-page.component';

describe('ServiceProviderPageComponent', () => {
  let component: ServiceProviderPageComponent;
  let fixture: ComponentFixture<ServiceProviderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceProviderPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceProviderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
