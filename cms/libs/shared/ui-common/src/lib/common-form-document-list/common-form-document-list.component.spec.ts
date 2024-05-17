import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonFormDocumentListComponent } from './common-form-document-list.component';

describe('CommonFormDocumentListComponent', () => {
  let component: CommonFormDocumentListComponent;
  let fixture: ComponentFixture<CommonFormDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonFormDocumentListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonFormDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
