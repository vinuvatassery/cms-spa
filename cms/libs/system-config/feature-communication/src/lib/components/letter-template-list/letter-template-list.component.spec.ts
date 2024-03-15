import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplateListComponent } from './letter-template-list.component';

describe('LetterTemplateListComponent', () => {
  let component: LetterTemplateListComponent;
  let fixture: ComponentFixture<LetterTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplateListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
