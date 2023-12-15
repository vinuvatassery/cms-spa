import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemInterfaceActivityLogListsComponent } from './system-interface-activity-log-lists.component';

describe('SystemInterfaceActivityLogListsComponent', () => {
  let component: SystemInterfaceActivityLogListsComponent;
  let fixture: ComponentFixture<SystemInterfaceActivityLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemInterfaceActivityLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemInterfaceActivityLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
