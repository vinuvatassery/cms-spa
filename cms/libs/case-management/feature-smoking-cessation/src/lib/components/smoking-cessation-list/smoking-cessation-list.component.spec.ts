import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokingCessationListComponent } from './smoking-cessation-list.component';

describe('SmokingCessationListComponent', () => {
  let component: SmokingCessationListComponent;
  let fixture: ComponentFixture<SmokingCessationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmokingCessationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmokingCessationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
