import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsMfrZipListComponent } from './ps-mfr-zip-list.component';

describe('PsMfrZipListComponent', () => {
  let component: PsMfrZipListComponent;
  let fixture: ComponentFixture<PsMfrZipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsMfrZipListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsMfrZipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
