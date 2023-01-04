import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronounsDetailComponent } from './pronouns-detail.component';

describe('PronounsDetailComponent', () => {
  let component: PronounsDetailComponent;
  let fixture: ComponentFixture<PronounsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PronounsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PronounsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
