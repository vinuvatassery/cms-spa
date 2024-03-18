import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseManagerPageComponent } from './case-manager-page.component';

describe('CaseManagerPageComponent', () => {
  let component: CaseManagerPageComponent;
  let fixture: ComponentFixture<CaseManagerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseManagerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
