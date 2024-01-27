import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessageListComponent } from './direct-message-list.component';

describe('DirectMessageListComponent', () => {
  let component: DirectMessageListComponent;
  let fixture: ComponentFixture<DirectMessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectMessageListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
