import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemInterfaceDashboardPageComponent } from './system-interface-dashboard-page.component';

describe('SystemInterfaceDashboardPageComponent', () => {
  let component: SystemInterfaceDashboardPageComponent;
  let fixture: ComponentFixture<SystemInterfaceDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemInterfaceDashboardPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemInterfaceDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
