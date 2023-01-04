import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexListComponent } from './index-list.component';

describe('IndexListComponent', () => {
  let component: IndexListComponent;
  let fixture: ComponentFixture<IndexListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
