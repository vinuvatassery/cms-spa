import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FplListComponent } from './fpl-list.component';

describe('FplListComponent', () => {
  let component: FplListComponent;
  let fixture: ComponentFixture<FplListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FplListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FplListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
