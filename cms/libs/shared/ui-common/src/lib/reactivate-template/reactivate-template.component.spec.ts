import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactivateTemplateComponent } from './reactivate-template.component';

describe('ReactivateTemplateComponent', () => {
  let component: ReactivateTemplateComponent;
  let fixture: ComponentFixture<ReactivateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactivateTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactivateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
