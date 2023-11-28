import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VednorRefundTpaSelectedClaimsListComponent } from './vednor-refund-tpa-selected-claims-list.component';

describe('VednorRefundTpaSelectedClaimsListComponent', () => {
  let component: VednorRefundTpaSelectedClaimsListComponent;
  let fixture: ComponentFixture<VednorRefundTpaSelectedClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VednorRefundTpaSelectedClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      VednorRefundTpaSelectedClaimsListComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
