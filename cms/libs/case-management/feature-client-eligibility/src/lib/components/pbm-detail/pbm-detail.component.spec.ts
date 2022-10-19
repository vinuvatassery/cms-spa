import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbmDetailComponent } from './pbm-detail.component';

describe('PbmDetailComponent', () => {
  let component: PbmDetailComponent;
  let fixture: ComponentFixture<PbmDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PbmDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PbmDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
