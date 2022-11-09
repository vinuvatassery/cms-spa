import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SexualOrientationListComponent } from './sexual-orientation-list.component';

describe('SexualOrientationListComponent', () => {
  let component: SexualOrientationListComponent;
  let fixture: ComponentFixture<SexualOrientationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SexualOrientationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SexualOrientationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
