import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportGroupComponent } from './support-group.component';

describe('SupportGroupComponent', () => {
  let component: SupportGroupComponent;
  let fixture: ComponentFixture<SupportGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
