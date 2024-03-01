import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConfigRouterPageComponent } from './system-config-router-page.component';

describe('SystemConfigRouterPageComponent', () => {
  let component: SystemConfigRouterPageComponent;
  let fixture: ComponentFixture<SystemConfigRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemConfigRouterPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemConfigRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
