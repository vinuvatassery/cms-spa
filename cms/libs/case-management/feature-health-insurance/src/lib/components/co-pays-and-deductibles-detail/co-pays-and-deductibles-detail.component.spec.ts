import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoPaysAndDeductiblesDetailComponent } from './co-pays-and-deductibles-detail.component';

describe('CoPaysAndDeductiblesDetailComponent', () => {
  let component: CoPaysAndDeductiblesDetailComponent;
  let fixture: ComponentFixture<CoPaysAndDeductiblesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPaysAndDeductiblesDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoPaysAndDeductiblesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
