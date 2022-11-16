import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsPurchasedListComponent } from './drugs-purchased-list.component';

describe('DrugsPurchasedListComponent', () => {
  let component: DrugsPurchasedListComponent;
  let fixture: ComponentFixture<DrugsPurchasedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugsPurchasedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugsPurchasedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
