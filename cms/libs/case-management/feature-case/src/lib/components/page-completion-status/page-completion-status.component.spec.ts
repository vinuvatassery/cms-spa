import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCompletionStatusComponent } from './page-completion-status.component';

describe('PageCompletionStatusComponent', () => {
  let component: PageCompletionStatusComponent;
  let fixture: ComponentFixture<PageCompletionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageCompletionStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageCompletionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
