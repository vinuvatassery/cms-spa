import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoPaysAndDeductiblesListComponent } from './co-pays-and-deductibles-list.component';

describe('CoPaysAndDeductiblesListComponent', () => {
  let component: CoPaysAndDeductiblesListComponent;
  let fixture: ComponentFixture<CoPaysAndDeductiblesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPaysAndDeductiblesListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoPaysAndDeductiblesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
