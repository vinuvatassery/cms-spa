import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VednorRefundTpaClaimsListComponent } from './vednor-refund-tpa-claims-list.component';

describe('VednorRefundTpaClaimsListComponent', () => {
  let component: VednorRefundTpaClaimsListComponent;
  let fixture: ComponentFixture<VednorRefundTpaClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VednorRefundTpaClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VednorRefundTpaClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
