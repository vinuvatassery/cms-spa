import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronounsListComponent } from './pronouns-list.component';

describe('PronounsListComponent', () => {
  let component: PronounsListComponent;
  let fixture: ComponentFixture<PronounsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PronounsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PronounsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
