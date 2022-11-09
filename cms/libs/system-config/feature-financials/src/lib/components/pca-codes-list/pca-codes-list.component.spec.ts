import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcaCodesListComponent } from './pca-codes-list.component';

describe('PcaCodesListComponent', () => {
  let component: PcaCodesListComponent;
  let fixture: ComponentFixture<PcaCodesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcaCodesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcaCodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
