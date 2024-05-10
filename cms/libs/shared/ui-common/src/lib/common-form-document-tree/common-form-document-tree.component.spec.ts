import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonFormDocumentTreeComponent } from './common-form-document-tree.component';

describe('CommonFormDocumentTreeComponent', () => {
  let component: CommonFormDocumentTreeComponent;
  let fixture: ComponentFixture<CommonFormDocumentTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonFormDocumentTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonFormDocumentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
