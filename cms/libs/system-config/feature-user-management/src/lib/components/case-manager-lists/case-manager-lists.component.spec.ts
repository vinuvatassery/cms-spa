import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseManagerListsComponent } from './case-manager-lists.component';

describe('CaseManagerListsComponent', () => {
  let component: CaseManagerListsComponent;
  let fixture: ComponentFixture<CaseManagerListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseManagerListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseManagerListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
