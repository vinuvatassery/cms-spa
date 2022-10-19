import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCareProviderDetailComponent } from './health-care-provider-detail.component';

describe('HealthCareProviderDetailComponent', () => {
  let component: HealthCareProviderDetailComponent;
  let fixture: ComponentFixture<HealthCareProviderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCareProviderDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCareProviderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
