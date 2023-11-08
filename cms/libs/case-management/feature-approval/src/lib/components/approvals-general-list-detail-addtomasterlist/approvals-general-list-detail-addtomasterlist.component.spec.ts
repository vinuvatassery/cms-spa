import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalsGeneralListDetailAddtomasterlistComponent } from './approvals-general-list-detail-addtomasterlist.component';

describe('ApprovalsGeneralListDetailAddtomasterlistComponent', () => {
  let component: ApprovalsGeneralListDetailAddtomasterlistComponent;
  let fixture: ComponentFixture<ApprovalsGeneralListDetailAddtomasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsGeneralListDetailAddtomasterlistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ApprovalsGeneralListDetailAddtomasterlistComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
