import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsMfrZipDetailComponent } from './ps-mfr-zip-detail.component';

describe('PsMfrZipDetailComponent', () => {
  let component: PsMfrZipDetailComponent;
  let fixture: ComponentFixture<PsMfrZipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsMfrZipDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsMfrZipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
