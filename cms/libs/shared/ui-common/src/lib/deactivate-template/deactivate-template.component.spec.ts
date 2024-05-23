import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateTemplateComponent } from './deactivate-template.component';

describe('DeactivateTemplateComponent', () => {
  let component: DeactivateTemplateComponent;
  let fixture: ComponentFixture<DeactivateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
