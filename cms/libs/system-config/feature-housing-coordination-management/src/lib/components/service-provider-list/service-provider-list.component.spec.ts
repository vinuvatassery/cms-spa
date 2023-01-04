import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderListComponent } from './service-provider-list.component';

describe('ServiceProviderListComponent', () => {
  let component: ServiceProviderListComponent;
  let fixture: ComponentFixture<ServiceProviderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceProviderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceProviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
