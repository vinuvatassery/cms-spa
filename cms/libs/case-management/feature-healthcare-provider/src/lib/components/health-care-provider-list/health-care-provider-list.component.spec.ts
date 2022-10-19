import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCareProviderListComponent } from './health-care-provider-list.component';

describe('HealthCareProviderListComponent', () => {
  let component: HealthCareProviderListComponent;
  let fixture: ComponentFixture<HealthCareProviderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCareProviderListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCareProviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
