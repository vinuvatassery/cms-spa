import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseAvailabilityPageComponent } from './case-availability-page.component';

describe('CaseAvailabilityPageComponent', () => {
  let component: CaseAvailabilityPageComponent;
  let fixture: ComponentFixture<CaseAvailabilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseAvailabilityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseAvailabilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
