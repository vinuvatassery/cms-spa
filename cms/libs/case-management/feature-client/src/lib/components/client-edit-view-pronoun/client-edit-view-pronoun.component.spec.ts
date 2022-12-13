import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewPronounComponent } from './client-edit-view-pronoun.component';

describe('ClientEditViewPronounComponent', () => {
  let component: ClientEditViewPronounComponent;
  let fixture: ComponentFixture<ClientEditViewPronounComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewPronounComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewPronounComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
