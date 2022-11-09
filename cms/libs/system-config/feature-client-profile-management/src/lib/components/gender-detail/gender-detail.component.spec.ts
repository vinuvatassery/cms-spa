import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderDetailComponent } from './gender-detail.component';

describe('GenderDetailComponent', () => {
  let component: GenderDetailComponent;
  let fixture: ComponentFixture<GenderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
