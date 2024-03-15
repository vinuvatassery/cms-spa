import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportGroupDetailComponent } from './support-group-detail.component';

describe('SupportGroupDetailComponent', () => {
  let component: SupportGroupDetailComponent;
  let fixture: ComponentFixture<SupportGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportGroupDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
