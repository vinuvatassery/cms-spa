import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterfaceSupportPageComponent } from './interface-support-page.component';

describe('InterfaceSupportPageComponent', () => {
  let component: InterfaceSupportPageComponent;
  let fixture: ComponentFixture<InterfaceSupportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterfaceSupportPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterfaceSupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
