import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcaCodesComponent } from './pca-codes.component';

describe('PcaCodesComponent', () => {
  let component: PcaCodesComponent;
  let fixture: ComponentFixture<PcaCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcaCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcaCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
