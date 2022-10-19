import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConfigNavigationComponent } from './system-config-navigation.component';

describe('SystemConfigNavigationComponent', () => {
  let component: SystemConfigNavigationComponent;
  let fixture: ComponentFixture<SystemConfigNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemConfigNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemConfigNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
